package cn.itxia.api.service

import cn.itxia.api.annotation.CurrentItxiaMember
import cn.itxia.api.dto.OrderRecordCreateDto
import cn.itxia.api.dto.OrderRecordTagCreateDto
import cn.itxia.api.dto.ReplyDto
import cn.itxia.api.model.ItxiaMember
import cn.itxia.api.model.OrderRecord
import cn.itxia.api.model.OrderRecordTag
import cn.itxia.api.response.Response
import cn.itxia.api.response.ResponseCode
import cn.itxia.api.util.PageRequestHelper
import org.bson.types.ObjectId
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Sort
import org.springframework.data.mongodb.core.MongoTemplate
import org.springframework.data.mongodb.core.query.Criteria
import org.springframework.data.mongodb.core.query.Query
import org.springframework.data.mongodb.core.query.Update
import org.springframework.stereotype.Service
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestParam

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

    fun createTag(@RequestBody dto: OrderRecordTagCreateDto,
                  @CurrentItxiaMember requester: ItxiaMember
    ): Response {
        if (mongoTemplate.exists(Query.query(
                        Criteria.where("name").`is`(dto.name)
                ), OrderRecordTag::class.java)) {
            return ResponseCode.ORDER_TAG_ALREADY_EXISTED.withoutPayload()
        }
        val tag = OrderRecordTag(
                _id = ObjectId.get().toHexString(),
                name = dto.name,
                createBy = requester.toBaseInfoOnly()
        )
        mongoTemplate.insert(tag)
        return ResponseCode.SUCCESS.withoutPayload()
    }

    fun getTags(@RequestParam(required = false) detail: String?): Response {
        return if (detail != null) {
            ResponseCode.SUCCESS.withPayload(mongoTemplate.findAll(OrderRecordTag::class.java))
        } else {
            ResponseCode.SUCCESS.withPayload(mongoTemplate.findAll(OrderRecordTag.Simple::class.java))
        }
    }

    fun deleteTag(tagID: String): Response {
        //TODO 查询是否有对应的记录
        val result = mongoTemplate.remove(Query.query(
                Criteria.where("_id").`is`(tagID)
                        .and("usedBy").size(0)
        ), OrderRecordTag::class.java)
        return if (result.deletedCount == 1L) {
            ResponseCode.SUCCESS.withoutPayload()
        } else {
            ResponseCode.ORDER_TAG_NOT_DELETED.withoutPayload()
        }
    }

    fun getSimpleTagsByID(tagIDArray: List<String>): List<OrderRecordTag.Simple> {
        return mongoTemplate.find(
                Query.query(Criteria.where("_id").`in`(tagIDArray)),
                OrderRecordTag.Simple::class.java
        )
    }

    fun postOrderRecord(dto: OrderRecordCreateDto,
                        requester: ItxiaMember
    ): Response {
        val order = orderService.getOrderByID(dto.order) ?: return ResponseCode.NO_SUCH_ORDER.withoutPayload()

        val tags = this.getSimpleTagsByID(dto.tags)

        val attachments = attachmentService.getAttachmentListByIDList(dto.attachments)

        val record = OrderRecord(
                _id = ObjectId.get().toHexString(),
                order = order,
                tags = tags,
                title = dto.title,
                content = dto.content,
                author = requester.toBaseInfoOnly(),
                attachments = attachments
        )

        val saved = mongoTemplate.insert(record)

        orderService.setOrderAsRecorded(orderID = order._id, recordID = saved._id)

        mongoTemplate.updateMulti(
                Query.query(Criteria.where("_id").`in`(tags.map { it._id })),
                Update().inc("referCount", 1),
                OrderRecordTag::class.java
        )

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
            criteria.and("onlyStar").`is`(requester)
        }
        if (tags != null) {
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

    fun starOrUnstarOrderRecord(recordID: String, requester: ItxiaMember, isUndo: Boolean) {
        val update = if (isUndo) Update().pull("starBy", requester) else Update().addToSet("starBy", requester)
        mongoTemplate.updateFirst(
                Query.query(Criteria.where("_id").`is`(recordID)),
                update,
                OrderRecord::class.java
        )
    }

    fun likeOrUnlikeOrderRecord(recordID: String, requester: ItxiaMember, isUndo: Boolean) {
        val update = if (isUndo) Update().pull("likeBy", requester) else Update().addToSet("likeBy", requester)
        mongoTemplate.updateFirst(
                Query.query(Criteria.where("_id").`is`(recordID)),
                update,
                OrderRecord::class.java
        )
    }

    fun postReplyToOrderRecord(recordID: String, replyDto: ReplyDto, requester: ItxiaMember) {
        val savedReply = replyService.saveReply(replyDto, requester)
        mongoTemplate.updateFirst(
                Query.query(Criteria.where("_id").`is`(recordID)),
                Update().push("comments", savedReply),
                OrderRecord::class.java
        )
    }

}
