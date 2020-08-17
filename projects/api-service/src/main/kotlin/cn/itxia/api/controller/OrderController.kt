package cn.itxia.api.controller

import cn.itxia.api.annotation.CurrentItxiaMember
import cn.itxia.api.annotation.RequireItxiaMember
import cn.itxia.api.dto.OrderReplyDto
import cn.itxia.api.dto.ReplyDto
import cn.itxia.api.dto.RequestOrderDto
import cn.itxia.api.enum.CampusEnum
import cn.itxia.api.enum.OrderActionEnum
import cn.itxia.api.enum.OrderStatusEnum
import cn.itxia.api.model.ItxiaMember
import cn.itxia.api.response.Response
import cn.itxia.api.response.ResponseCode
import cn.itxia.api.service.OrderService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.*

@RestController
class OrderController {

    @Autowired
    private lateinit var orderService: OrderService

    /**
     * 发起预约.
     * */
    @PostMapping("/custom/order")
    fun requestOrder(@RequestBody dto: RequestOrderDto): Response {
        return orderService.requestOrder(dto)
    }

    /**
     * 取消预约.
     * */
    @PutMapping("/custom/order/{orderID}/cancel")
    fun cancelOrder(@PathVariable orderID: String): Response {
        return orderService.cancelOrder(orderID)
    }

    /**
     * 查询预约单.
     * */
    @GetMapping("/custom/order/{orderID}")
    fun getCustomOrder(@PathVariable orderID: String): Response {
        return orderService.getCustomOrder(orderID)
    }

    /**
     * (预约者)回复预约单.
     * */
    @PostMapping("/custom/order/{orderID}/reply")
    fun postReplyByCustom(@PathVariable orderID: String,
                          @RequestBody dto: ReplyDto
    ): Response {
        if (orderService.postReplyByCustom(orderID, dto)) {
            return ResponseCode.SUCCESS.withoutPayload()
        }
        return ResponseCode.NO_SUCH_ORDER.withoutPayload()
    }


    //---------------------------------------------------------

    /**
     * 获取分页预约单.
     * */
    @GetMapping("/order")
    @RequireItxiaMember
    fun getAllOrders(@RequestParam(required = false) page: Int?,
                     @RequestParam(required = false) size: Int?,
                     @RequestParam(required = false) campus: List<String>?,
                     @RequestParam(required = false) status: List<String>?,
                     @RequestParam(required = false) direction: String?,
                     @RequestParam(required = false) onlyMine: String?,
                     @CurrentItxiaMember member: ItxiaMember
    ): Response {
        val actualPage = if (page == null || page < 0) 0 else page
        val actualSize = if (size == null || size < 10 || size > 50) 20 else size
        val onlyByMember = if (onlyMine != null) member else null
        val actualCampus = campus?.mapNotNull { CampusEnum.parse(it) }
        val actualStatus = status?.mapNotNull { OrderStatusEnum.parse(it) }

        val result = orderService.getPageableOrder(
                actualPage, actualSize, actualCampus, actualStatus, onlyByMember
        )
        return ResponseCode.SUCCESS.withPayload(result)
    }

    /**
     * 处理预约单.
     * 接单、放回、完成、删除...
     * */
    @PutMapping("/order/{oid}/deal/{action}")
    @RequireItxiaMember
    fun dealWithOrder(@PathVariable oid: String,
                      @PathVariable action: String,
                      @CurrentItxiaMember itxiaMember: ItxiaMember
    ): Response {
        val trueAction = OrderActionEnum.parse(action)
                ?: return ResponseCode.INVALID_PARAM.withPayload("处理字段参数错误")
        return orderService.dealWithOrder(oid, trueAction, itxiaMember)
    }

    /**
     * (IT侠)回复预约单.
     * */
    @PostMapping("/order/{orderID}/reply")
    @RequireItxiaMember
    fun postReply(@PathVariable orderID: String,
                  @RequestBody dto: OrderReplyDto,
                  @CurrentItxiaMember itxiaMember: ItxiaMember
    ): Response {
        if (orderService.postReply(orderID, dto, itxiaMember)) {
            return ResponseCode.SUCCESS.withoutPayload()
        }
        return ResponseCode.NO_SUCH_ORDER.withoutPayload()
    }

    /**
     * 讨论预约单.
     * */
    @PostMapping("/order/{orderID}/discuss")
    @RequireItxiaMember
    fun postDiscuss(@PathVariable orderID: String,
                    @RequestBody dto: ReplyDto,
                    @CurrentItxiaMember itxiaMember: ItxiaMember
    ): Response {
        if (orderService.postDiscuss(orderID, dto, itxiaMember)) {
            return ResponseCode.SUCCESS.withoutPayload()
        }
        return ResponseCode.NO_SUCH_ORDER.withoutPayload()
    }
}
