package cn.itxia.api.service

import cn.itxia.api.annotation.CurrentItxiaMember
import cn.itxia.api.dto.OrderRecordCreateDto
import cn.itxia.api.dto.OrderRecordModifyDto
import cn.itxia.api.dto.OrderRecordTagCreateDto
import cn.itxia.api.dto.ReplyDto
import cn.itxia.api.model.ItxiaMember
import cn.itxia.api.model.OrderRecord
import cn.itxia.api.model.OrderRecordHistory
import cn.itxia.api.model.OrderRecordTag
import cn.itxia.api.model.repository.OrderRecordRepository
import cn.itxia.api.model.repository.OrderRecordTagRepository
import cn.itxia.api.response.Response
import cn.itxia.api.response.ResponseCode
import cn.itxia.api.util.PageRequestHelper
import com.mongodb.DBRef
import org.bson.types.ObjectId
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Sort
import org.springframework.data.mongodb.core.MongoTemplate
import org.springframework.data.mongodb.core.query.Criteria
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import org.springframework.web.bind.annotation.RequestBody
import java.util.*

@Service
class OrderRecordService {

    @Autowired
    private lateinit var mongoTemplate: MongoTemplate

    @Autowired
    private lateinit var orderService: OrderService

    @Autowired
    private lateinit var attachmentService: AttachmentService

    @Autowired
    private lateinit var replyService: ReplyService

    @Autowired
    private lateinit var orderRecordRepository: OrderRecordRepository

    @Autowired
    private lateinit var orderRecordTagRepository: OrderRecordTagRepository

    /**
     * 新增标签.
     * */
    fun createTag(@RequestBody dto: OrderRecordTagCreateDto,
                  @CurrentItxiaMember requester: ItxiaMember
    ): Response {
        if (orderRecordTagRepository.existsByName(dto.name)) {
            return ResponseCode.ORDER_TAG_ALREADY_EXISTED.withoutPayload()
        }
        val tag = OrderRecordTag(
                _id = ObjectId.get().toHexString(),
                name = dto.name,
                createBy = requester.toBaseInfoOnly()
        )
        orderRecordTagRepository.save(tag)
        return ResponseCode.SUCCESS.withoutPayload()
    }

    /**
     * 返回所有标签.
     * @param detail 若为false则返回简单标签
     * */
    fun getTags(detail: Boolean): Response {
        val allTags = orderRecordTagRepository.findAll()
        return if (detail) {
            ResponseCode.SUCCESS.withPayload(allTags)
        } else {
            ResponseCode.SUCCESS.withPayload(
                    allTags.map {
                        OrderRecordTag.Simple(
                                _id = it._id,
                                name = it.name
                        )
                    }
            )
        }
    }

    /**
     * 删除标签.
     * 只能删除没被引用过的.
     * */
    fun deleteTag(tagID: String): Response {
        val tag = orderRecordTagRepository.findByIdOrNull(tagID)

        if (tag == null || tag.referCount > 0) {
            return ResponseCode.ORDER_TAG_NOT_DELETED.withoutPayload()
        }

        orderRecordTagRepository.delete(tag)
        return ResponseCode.SUCCESS.withoutPayload()
    }

    /**
     * 返回ID列表对应的简单标签.
     * */
    fun getSimpleTagsByID(tagIDArray: List<String>): List<OrderRecordTag.Simple> {
        return orderRecordTagRepository.findAllById(tagIDArray).map {
            it.toSimple()
        }
    }

    /**
     * 发布新记录.
     * */
    fun postOrderRecord(dto: OrderRecordCreateDto,
                        requester: ItxiaMember
    ): Response {
        val order = orderService.getOrderByID(dto.order) ?: return ResponseCode.NO_SUCH_ORDER.withoutPayload()

        val tags = orderRecordTagRepository.findAllById(dto.tags)

        val attachments = attachmentService.getAttachmentListByIDList(dto.attachments)

        val record = OrderRecord(
                _id = ObjectId.get().toHexString(),
                order = order,
                tags = tags.map {
                    it.toSimple()
                },
                title = dto.title,
                content = dto.content,
                author = requester.toBaseInfoOnly(),
                attachments = attachments
        )

        val saved = orderRecordRepository.save(record)

        orderService.setOrderAsRecorded(orderID = order._id, recordID = saved._id)

        tags.forEach { it.referCount++ }
        orderRecordTagRepository.saveAll(tags)

        return ResponseCode.SUCCESS.withPayload(saved)
    }

    fun getOrderRecords(page: Int?,
                        size: Int?,
                        onlyStar: String?,
                        tags: String?,
                        text: String?,
                        requester: ItxiaMember
    ): Response {
        val criteria = Criteria()
        if (onlyStar != null) {
            criteria.and("starBy").`is`(requester)
        }
        if (!tags.isNullOrEmpty()) {
            //convert to tag id array
            val tagIDArray = tags.split(",")
            criteria.and("tags").`in`(tagIDArray)
        }
        if (text != null) {
            criteria.orOperator(
                    Criteria.where("title").regex(text, "i"),
                    Criteria.where("content").regex(text, "i")
            )
        }

        val result = PageRequestHelper.getPaginationResult(
                page = page,
                size = size,
                criteria = criteria,
                sort = Sort.by("createTime").descending(),
                entityClass = OrderRecord::class.java,
                mongoTemplate = mongoTemplate
        )

        return ResponseCode.SUCCESS.withPayload(result)
    }

    /**
     * 收藏/取消收藏.
     * */
    fun starOrUnstarOrderRecord(recordID: String, requester: ItxiaMember, isUndo: Boolean) {
        val record = orderRecordRepository.findByIdOrNull(recordID) ?: return
        val starBy = record.starBy.toMutableList()

        if (isUndo) {
            starBy.removeIf { it._id == requester._id }
        } else {
            starBy.add(requester.toBaseInfoOnly())
        }

        orderRecordRepository.save(record)
    }

    /**
     * 点赞/取消赞.
     * */
    fun likeOrUnlikeOrderRecord(recordID: String, requester: ItxiaMember, isUndo: Boolean) {
        val record = orderRecordRepository.findByIdOrNull(recordID) ?: return
        val likeBy = record.likeBy.toMutableList()

        if (isUndo) {
            likeBy.removeIf { it._id == requester._id }
        } else {
            likeBy.add(requester.toBaseInfoOnly())
        }

        orderRecordRepository.save(record)
    }

    /**
     * 发表评论到记录.
     * */
    fun postReplyToOrderRecord(recordID: String, replyDto: ReplyDto, requester: ItxiaMember) {
        val record = orderRecordRepository.findByIdOrNull(recordID) ?: return

        val savedReply = replyService.saveReply(replyDto, requester)

        record.comments.toMutableList().add(savedReply)
        orderRecordRepository.save(record)
    }

    /**
     * 更改记录.
     * */
    fun modifyOrderRecord(dto: OrderRecordModifyDto,
                          recordID: String,
                          requester: ItxiaMember
    ): Response {
        val record = orderRecordRepository.findByIdOrNull(recordID)
                ?: return ResponseCode.NO_SUCH_ORDER_RECORD.withoutPayload()

        val history = OrderRecordHistory(
                modifyTime = record.lastModified ?: record.createTime,
                author = record.author,
                title = record.title,
                content = record.content,
                tags = record.tags
        )

        //增减标签引用次数
        val originTags = orderRecordTagRepository.findAllById(record.tags.map { it._id })
        originTags.forEach { it.referCount-- }
        orderRecordTagRepository.saveAll(originTags)

        val newTags = orderRecordTagRepository.findAllById(dto.tags)
        newTags.forEach { it.referCount++ }
        val actualNewTags = orderRecordTagRepository.saveAll(newTags)

        record.apply {
            title = dto.title
            content = dto.content
            tags = actualNewTags.map {
                it.toSimple()
            }
            lastModified = Date()
            lastModifiedBy = requester.toBaseInfoOnly()
            modifyHistory.toMutableList().add(history)
        }

        orderRecordRepository.save(record)

        return ResponseCode.SUCCESS.withoutPayload()
    }

    fun resetDBRefs() {
        val all = orderRecordRepository.findAll()
        orderRecordRepository.saveAll(all)
    }

}
