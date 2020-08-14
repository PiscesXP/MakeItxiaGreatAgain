package cn.itxia.api.service

import cn.itxia.api.dto.RequestOrderDto
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
import org.bson.types.ObjectId
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import org.springframework.stereotype.Service

@Service
class OrderService {

    @Autowired
    private lateinit var orderRepository: OrderRepository

    @Autowired
    private lateinit var attachmentRepository: AttachmentRepository

    @Autowired
    private lateinit var emailService: EmailService

    /**
     * 分页查询预约单.
     * */
    fun getPageableOrder(
            page: Int,
            pageSize: Int,
            campus: List<CampusEnum>?,
            status: List<OrderStatusEnum>?,
            onlyByMember: ItxiaMember?
    ): OrderQueryResultVo {

        //如果没有指定校区/预约单状态，则查询全部
        val campusList = campus ?: CampusEnum.values().toList()
        val statusList = status ?: OrderStatusEnum.values().toList()

        //符合条件的总数
        val totalCount = if (onlyByMember == null) {
            orderRepository.countByCampusInAndStatusInAndDeletedFalse(
                    campus = campusList,
                    status = statusList
            )
        } else {
            orderRepository.countByCampusInAndStatusInAndHandlerAndDeletedFalse(
                    campus = campusList,
                    status = statusList,
                    handler = onlyByMember.toBaseInfoOnly()
            )
        }

        //最大可能的页数
        var maxPossiblePageCount = totalCount / pageSize + 1
        if (totalCount % pageSize == 0) {
            --maxPossiblePageCount
        }
        if (maxPossiblePageCount < 1) {
            maxPossiblePageCount = 1
        }

        //当前页码
        val currentPage = if (page < maxPossiblePageCount) page else maxPossiblePageCount

        val pageable = PageRequest.of(
                currentPage - 1, pageSize, Sort.Direction.DESC, "createTime")
        //查询
        val orderList = if (onlyByMember == null) {
            orderRepository.findByCampusInAndStatusInAndDeletedFalse(
                    campusList,
                    statusList,
                    pageable
            )
        } else {
            orderRepository.findByCampusInAndStatusInAndHandlerAndDeletedFalse(
                    campusList,
                    statusList,
                    onlyByMember.toBaseInfoOnly(),
                    pageable
            )
        }

        return OrderQueryResultVo(
                OrderQueryResultVo.Pagination(
                        currentPage, totalCount, pageSize
                ),
                orderList
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
                attachments = attachments
        )
        val savedOrder = orderRepository.save(order)
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
        val response = when (true) {
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
        //发邮件提醒
        emailService.noticeOrderStatusChange(order, action, itxiaMember)
        return response
    }


}
