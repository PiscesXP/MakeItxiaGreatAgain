package cn.itxia.api.service

import cn.itxia.api.dto.OrderReplyDto
import cn.itxia.api.dto.ReplyDto
import cn.itxia.api.dto.RequestOrderDto
import cn.itxia.api.dto.RetrieveOrderDto
import cn.itxia.api.enum.CampusEnum
import cn.itxia.api.enum.MemberRoleEnum
import cn.itxia.api.enum.OrderActionEnum
import cn.itxia.api.enum.OrderStatusEnum
import cn.itxia.api.model.ItxiaMember
import cn.itxia.api.model.Order
import cn.itxia.api.model.repository.AttachmentRepository
import cn.itxia.api.model.repository.OrderRepository
import cn.itxia.api.response.Response
import cn.itxia.api.response.ResponseCode
import cn.itxia.api.vo.OrderQueryResultVo
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch
import org.bson.types.ObjectId
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import org.springframework.data.mongodb.core.MongoTemplate
import org.springframework.data.mongodb.core.query.Criteria
import org.springframework.data.mongodb.core.query.Query
import org.springframework.data.mongodb.core.query.Update
import org.springframework.stereotype.Service
import java.text.ParseException
import java.text.SimpleDateFormat

@Service
class OrderService {

    @Autowired
    private lateinit var orderRepository: OrderRepository

    @Autowired
    private lateinit var attachmentRepository: AttachmentRepository

    @Autowired
    private lateinit var replyService: ReplyService

    @Autowired
    private lateinit var emailService: EmailService

    @Autowired
    private lateinit var memberService: MemberService

    @Autowired
    private lateinit var chatBotLinkService: ChatBotLinkService

    @Autowired
    private lateinit var mongoTemplate: MongoTemplate

    /**
     * 查询预约单.
     * */
    fun queryOrder(
        page: Int,
        size: Int,
        onlyMine: Boolean = false,
        campus: CampusEnum?,
        status: OrderStatusEnum?,
        text: String?,
        startTime: String?,
        endTime: String?,
        showDeleted: Boolean = false,
        itxiaMember: ItxiaMember
    ): OrderQueryResultVo {

        val criteria = Criteria()
        if (!showDeleted) {
            criteria.and("deleted").`is`(false)
        }
        if (onlyMine) {
            criteria.and("handler").`is`(itxiaMember._id)
        }
        if (campus != null) {
            criteria.and("campus").`is`(campus)
        }
        if (status != null) {
            criteria.and("status").`is`(status)
        }
        if (text != null) {
            criteria.orOperator(
                Criteria.where("name").regex(text, "i"),
                Criteria.where("phone").regex(text, "i"),
                Criteria.where("email").regex(text, "i"),
                Criteria.where("qq").regex(text, "i"),
                Criteria.where("warranty").regex(text, "i"),
                Criteria.where("brandModel").regex(text, "i"),
                Criteria.where("description").regex(text, "i")
            )
        }
        if (startTime != null && endTime != null) {
            try {
                val formatter = SimpleDateFormat("yyyy-MM-dd")
                val start = formatter.parse(startTime)
                val end = formatter.parse(endTime)
                criteria.and("createTime").gte(start).lte(end)
            } catch (e: ParseException) {
                //ignore this param
            }
        }


        val totalCount = mongoTemplate.count(Query.query(criteria), Order::class.java).toInt()

        //最大可能的页数
        var maxPossiblePageCount = totalCount / size + 1
        if (totalCount % size == 0) {
            --maxPossiblePageCount
        }
        if (maxPossiblePageCount < 1) {
            maxPossiblePageCount = 1
        }

        //当前页码
        val currentPage = if (page < maxPossiblePageCount) page else maxPossiblePageCount

        val pageRequest = PageRequest.of(currentPage - 1, size, Sort.Direction.DESC, "createTime")
        val sortByCreateTime = Sort.by("createTime").descending()

        val data = mongoTemplate.find(
            Query.query(criteria).with(pageRequest).with(sortByCreateTime),
            Order::class.java
        )

        return OrderQueryResultVo(
            OrderQueryResultVo.Pagination(
                currentPage = currentPage,
                totalCount = totalCount,
                pageSize = size
            ), data = data
        )
    }

    /**
     * 发起预约.
     * */
    fun requestOrder(dto: RequestOrderDto): Response {
        val campus = CampusEnum.parse(dto.campus)
            ?: return ResponseCode.INVALID_PARAM.withPayload("校区填写不正确")

        val attachments = dto.attachments.mapNotNull { attachmentRepository.findById(it).orElse(null) }

        val order = Order(
            _id = ObjectId.get().toHexString(),
            name = dto.name,
            phone = dto.phone,
            qq = dto.qq,
            email = dto.email,
            os = dto.os,
            brandModel = dto.brandModel,
            warranty = dto.warranty,
            campus = campus,
            description = dto.description,
            attachments = attachments,
            acceptEmailNotification = dto.acceptEmailNotification
        )
        val savedOrder = orderRepository.save(order)

        //提醒(接收邮件推送)的it侠，有新的预约单
        memberService.getAllMemberThatReceiveEmailNotification(
            "onMyCampusHasNewOrder", savedOrder.campus
        ).forEach { member ->
            member.email?.let { emailAddress ->
                emailService.noticeItxiaMemberThatCampusHasNewOrder(emailAddress, savedOrder, member)
            }
        }

        GlobalScope.launch {
            chatBotLinkService.notifyNewOrder(order)
        }

        return ResponseCode.SUCCESS.withPayload(savedOrder)
    }

    /**
     * 查询预约单.
     * */
    fun getCustomOrder(orderID: String): Response {
        val order = orderRepository.findBy_idAndDeletedFalse(orderID)
            ?: return ResponseCode.NO_SUCH_ORDER.withoutPayload()
        return ResponseCode.SUCCESS.withPayload(order)
    }

    /**
     * 取消预约.
     * */
    fun cancelOrder(orderID: String): Response {
        val order = orderRepository.findBy_idAndDeletedFalse(orderID)
            ?: return ResponseCode.NO_SUCH_ORDER.withoutPayload()
        if (order.status == OrderStatusEnum.PENDING) {
            order.status = OrderStatusEnum.CANCELED
            orderRepository.save(order)
            return ResponseCode.SUCCESS.withPayload("预约已取消")
        }
        return ResponseCode.ORDER_STATUS_INCORRECT.withPayload("只能取消等待接单的预约单")
    }


    /**
     * 处理预约单.
     * */
    fun dealWithOrder(oid: String, action: OrderActionEnum, itxiaMember: ItxiaMember): Response {
        val order = orderRepository.findBy_idAndDeletedFalse(oid)
            ?: return ResponseCode.NO_SUCH_ORDER.withPayload("请确认预约单是否存在")

        //是否是自己的单子
        val isMyOrder = order.handler?._id == itxiaMember._id

        //是否能删除预约单(只有管理员可以删)
        val canIDelete = itxiaMember.role == MemberRoleEnum.ADMIN || itxiaMember.role == MemberRoleEnum.SUPER_ADMIN

        //switch true真好玩
        return when (true) {
            action == OrderActionEnum.ACCEPT && order.status == OrderStatusEnum.PENDING -> {
                //接单
                order.status = OrderStatusEnum.HANDLING
                order.handler = itxiaMember.toBaseInfoOnly()
                orderRepository.save(order)
                ResponseCode.SUCCESS.withoutPayload()
            }
            action == OrderActionEnum.GIVEUP && order.status == OrderStatusEnum.HANDLING && isMyOrder -> {
                //放回
                order.status = OrderStatusEnum.PENDING
                order.handler = null
                orderRepository.save(order)
                ResponseCode.SUCCESS.withoutPayload()
            }
            action == OrderActionEnum.DONE && order.status == OrderStatusEnum.HANDLING && isMyOrder -> {
                //完成预约单
                order.status = OrderStatusEnum.DONE
                order.requireRecord = true
                orderRepository.save(order)
                ResponseCode.SUCCESS.withoutPayload()
            }
            action == OrderActionEnum.DELETE && order.status == OrderStatusEnum.HANDLING || order.status == OrderStatusEnum.PENDING -> {
                //删除预约单
                //暂时只能删除等待处理、正在处理的单子
                if (canIDelete) {
                    order.deleted = true
                    orderRepository.save(order)
                    ResponseCode.SUCCESS.withoutPayload()
                } else {
                    ResponseCode.UNAUTHORIZED.withPayload("只有管理员才能删除预约单")
                }
            }
            else -> {
                ResponseCode.ORDER_STATUS_INCORRECT.withPayload("请检查预约单状态 (也许已经被别人接单了)")
            }
        }
    }

    fun postReply(orderID: String, dto: OrderReplyDto, itxiaMember: ItxiaMember): Boolean {
        val order = orderRepository.findBy_idAndDeletedFalse(orderID) ?: return false
        val reply = replyService.saveReply(ReplyDto(dto.content, dto.attachments), itxiaMember)
        order.reply.add(reply)
        orderRepository.save(order)
        if (order.acceptEmailNotification && dto.sendEmailNotification == true && order.email != null) {
            //发送邮件提醒
            emailService.noticeCustomNewReply(order.email, order, reply, itxiaMember)
        }
        return true
    }

    fun postReplyByCustom(orderID: String, dto: ReplyDto): Boolean {
        val order = orderRepository.findBy_idAndDeletedFalse(orderID) ?: return false
        val reply = replyService.saveReply(dto, null)
        order.reply.add(reply)
        orderRepository.save(order)

        val handler = memberService.getMemberByID(order.handler?._id)
        if (handler != null && handler.emailNotification.onMyOrderHasNewReply) {
            //发送邮件提醒预约人，有新回复
            handler.email?.let {
                emailService.noticeItxiaMemberThatOrderHasNewReply(
                    address = it,
                    order = order,
                    reply = reply,
                    itxiaMember = handler
                )
            }
        }
        return true
    }

    fun postDiscuss(orderID: String, dto: ReplyDto, itxiaMember: ItxiaMember): Boolean {
        val order = orderRepository.findBy_idAndDeletedFalse(orderID) ?: return false
        val reply = replyService.saveReply(dto, itxiaMember)
        order.discuss.add(reply)
        orderRepository.save(order)
        return true
    }

    /**
     * 找回预约单.
     * 如果有多个满足条件，会返回最近的一个.
     * @return 返回预约单对应的ID.
     * */
    fun retrieveOrder(dto: RetrieveOrderDto): String? {
        val order = mongoTemplate.findOne(
            Query.query(
                Criteria.where("name").`is`(dto.name)
                    .and("phone").`is`(dto.phone)
                    .and("deleted").ne(true)
            )
                .with(
                    Sort.by("createTime").descending()
                ),
            Order::class.java
        )
        return order?._id
    }

    /**
     * 返回ID对应的预约单.
     * */
    fun getOrderByID(orderID: String): Order? {
        return mongoTemplate.findById(orderID, Order::class.java)
    }

    /**
     * 获取itxia已完成的但需要填写记录的预约单的列表.
     * */
    fun getMyDoneOrdersWhichRequireRecord(requester: ItxiaMember): List<Order> {
        return mongoTemplate.find(
            Query.query(
                Criteria.where("requireRecord").`is`(true)
                    .and("handler").`is`(requester._id)
            ),
            Order::class.java
        )
    }

    /**
     * 将预约单设置为已记录.
     * */
    fun setOrderAsRecorded(orderID: String, recordID: String) {
        mongoTemplate.updateFirst(
            Query.query(
                Criteria.where("_id").`is`(orderID)
            ),
            Update.update("recordID", recordID).set("requireRecord", false),
            Order::class.java
        )
    }
}
