package cn.itxia.api.controller

import cn.itxia.api.annotation.CurrentItxiaMember
import cn.itxia.api.annotation.RequireItxiaMember
import cn.itxia.api.dto.OrderRecordCreateDto
import cn.itxia.api.dto.OrderRecordModifyDto
import cn.itxia.api.dto.OrderRecordTagCreateDto
import cn.itxia.api.dto.ReplyDto
import cn.itxia.api.model.ItxiaMember
import cn.itxia.api.response.Response
import cn.itxia.api.response.ResponseCode
import cn.itxia.api.service.OrderRecordService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.*

@RestController
class OrderRecordController {

    @Autowired
    private lateinit var orderRecordService: OrderRecordService

    /**
     * 添加tag.
     * */
    @PostMapping("/orderRecordTag")
    @RequireItxiaMember
    fun createTag(@RequestBody dto: OrderRecordTagCreateDto,
                  @CurrentItxiaMember requester: ItxiaMember
    ): Response {
        return orderRecordService.createTag(dto, requester)
    }

    /**
     * 获取tag.
     * 有detail字段返回更多内容.
     * 不用detail字段则只返回_id和name.
     * */
    @GetMapping("/orderRecordTag")
    @RequireItxiaMember
    fun getTags(@RequestParam(required = false) detail: String?): Response {
        return orderRecordService.getTags(detail)
    }

    /**
     * 删除tag.
     * 仅删除没被引用过的.
     * */
    @DeleteMapping("/orderRecordTag/{tagID}")
    @RequireItxiaMember
    fun deleteTag(@PathVariable tagID: String): Response {
        return orderRecordService.deleteTag(tagID)
    }

    /**
     * 提交新的预约单记录.
     * */
    @PostMapping("/orderRecord")
    @RequireItxiaMember
    fun postOrderRecord(@RequestBody dto: OrderRecordCreateDto,
                        @CurrentItxiaMember requester: ItxiaMember
    ): Response {
        return orderRecordService.postOrderRecord(dto, requester)
    }

    /**
     * 查询记录.
     * TODO 添加更多筛选条件
     * */
    @GetMapping("/orderRecord")
    @RequireItxiaMember
    fun getOrderRecords(@RequestParam(required = false) page: Int?,
                        @RequestParam(required = false) size: Int?,
                        @RequestParam(required = false) onlyStar: String?,
                        @RequestParam(required = false) tags: String?,
                        @RequestParam(required = false) text: String?,
                        @CurrentItxiaMember requester: ItxiaMember
    ): Response {
        return orderRecordService.getOrderRecords(
                page = page,
                size = size,
                onlyStar = onlyStar,
                tags = tags,
                text = text,
                requester = requester
        )
    }

    /**
     * 修改记录.
     * */
    @PutMapping("/orderRecord/{recordID}")
    @RequireItxiaMember
    fun modifyOrderRecord(@RequestBody dto: OrderRecordModifyDto,
                          @PathVariable recordID: String,
                          @CurrentItxiaMember requester: ItxiaMember
    ): Response {
        return orderRecordService.modifyOrderRecord(dto, recordID, requester)
    }

    /**
     * 发表评论.
     * */
    @PostMapping("/orderRecord/{recordID}/comments")
    @RequireItxiaMember
    fun postReply(@PathVariable recordID: String,
                  @RequestBody replyDto: ReplyDto,
                  @CurrentItxiaMember requester: ItxiaMember
    ): Response {
        orderRecordService.postReplyToOrderRecord(recordID, replyDto, requester)
        return ResponseCode.SUCCESS.withoutPayload()
    }

    /**
     * 收藏.
     * */
    @PutMapping("/orderRecord/{recordID}/star")
    @RequireItxiaMember
    fun starOrderRecord(@PathVariable recordID: String,
                        @CurrentItxiaMember requester: ItxiaMember
    ): Response {
        orderRecordService.starOrUnstarOrderRecord(recordID, requester, false)
        return ResponseCode.SUCCESS.withoutPayload()
    }

    /**
     * 取消收藏.
     * */
    @PutMapping("/orderRecord/{recordID}/unstar")
    @RequireItxiaMember
    fun unstarOrderRecord(@PathVariable recordID: String,
                          @CurrentItxiaMember requester: ItxiaMember
    ): Response {
        orderRecordService.starOrUnstarOrderRecord(recordID, requester, true)
        return ResponseCode.SUCCESS.withoutPayload()
    }

    /**
     * 点赞.
     * */
    @PutMapping("/orderRecord/{recordID}/like")
    @RequireItxiaMember
    fun likeOrderRecord(@PathVariable recordID: String,
                        @CurrentItxiaMember requester: ItxiaMember
    ): Response {
        orderRecordService.likeOrUnlikeOrderRecord(recordID, requester, false)
        return ResponseCode.SUCCESS.withoutPayload()
    }

    /**
     * 取消点赞.
     * */
    @PutMapping("/orderRecord/{recordID}/unlike")
    @RequireItxiaMember
    fun unlikeOrderRecord(@PathVariable recordID: String,
                          @CurrentItxiaMember requester: ItxiaMember
    ): Response {
        orderRecordService.likeOrUnlikeOrderRecord(recordID, requester, true)
        return ResponseCode.SUCCESS.withoutPayload()
    }

}
