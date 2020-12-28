package cn.itxia.api.controller

import cn.itxia.api.annotation.CurrentItxiaMember
import cn.itxia.api.annotation.RequireItxiaMember
import cn.itxia.api.dto.AnnouncementModifyDto
import cn.itxia.api.dto.AnnouncementPublishDto
import cn.itxia.api.dto.AnnouncementReorderDto
import cn.itxia.api.dto.ReplyDto
import cn.itxia.api.enum.MemberRoleEnum
import cn.itxia.api.model.ItxiaMember
import cn.itxia.api.response.Response
import cn.itxia.api.response.ResponseCode
import cn.itxia.api.service.AnnouncementService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*

/**
 * 公告相关.
 * */
@RestController
class AnnouncementController {

    @Autowired
    private lateinit var announcementService: AnnouncementService

    /**
     * (IT侠成员)获取公告.
     * 默认是内部公告.
     * */
    @GetMapping("/announcement")
    @RequireItxiaMember
    fun getAnnouncements(): Response {
        return ResponseCode.SUCCESS.withPayload(announcementService.getInternalAnnouncements())
    }

    /**
     * 获取外部公告.
     * (预约页面)
     * */
    @GetMapping("/custom/announcement")
    fun getExternalAnnouncements(): Response {
        return ResponseCode.SUCCESS.withPayload(announcementService.getExternalAnnouncements())
    }

    @GetMapping("/announcement/all")
    @RequireItxiaMember
    fun getAllAnnouncement(): Response {
        return ResponseCode.SUCCESS.withPayload(announcementService.getAllAnnouncement())
    }

    /**
     * 发布公告.
     * */
    @PostMapping("/announcement")
    @RequireItxiaMember(MemberRoleEnum.ADMIN)
    fun publishAnnouncement(
        @RequestBody dto: AnnouncementPublishDto,
        @CurrentItxiaMember itxiaMember: ItxiaMember
    ): Response {
        val result = announcementService.publishAnnouncement(dto, itxiaMember)
            ?: return ResponseCode.INVALID_PARAM.withPayload("公告类型必须为内部或外部.")
        return ResponseCode.SUCCESS.withPayload(result)
    }

    /**
     * 点赞.
     * */
    @PutMapping("/announcement/{aid}/like")
    @RequireItxiaMember
    fun like(
        @PathVariable aid: String,
        @CurrentItxiaMember itxiaMember: ItxiaMember
    ): Response {
        announcementService.likeOrUnlike(aid, itxiaMember, true)
        return ResponseCode.SUCCESS.withoutPayload()
    }

    /**
     * 取消赞.
     * */
    @PutMapping("/announcement/{aid}/unlike")
    @RequireItxiaMember
    fun unlike(
        @PathVariable aid: String,
        @CurrentItxiaMember itxiaMember: ItxiaMember
    ): Response {
        announcementService.likeOrUnlike(aid, itxiaMember, false)
        return ResponseCode.SUCCESS.withoutPayload()
    }

    /**
     * 回复/评论公告.
     * */
    @PostMapping("/announcement/{aid}/comment")
    @RequireItxiaMember
    fun comment(
        @PathVariable aid: String,
        @RequestBody @Validated replyDto: ReplyDto,
        @CurrentItxiaMember itxiaMember: ItxiaMember
    ): Response {
        if (announcementService.comment(aid, replyDto, itxiaMember)) {
            return ResponseCode.SUCCESS.withPayload("评论发表成功")
        }
        return ResponseCode.UNKNOWN_ERROR.withPayload("评论发表失败")
    }

    /**
     * 删除公告.
     * */
    @DeleteMapping("/announcement/{aid}")
    @RequireItxiaMember(role = MemberRoleEnum.ADMIN)
    fun deleteAnnouncement(@PathVariable aid: String): Response {
        announcementService.deleteAnnouncement(aid)
        return ResponseCode.SUCCESS.withoutPayload()
    }

    /**
     * 排序公告.
     * */
    @PutMapping("/announcement/all/order")
    @RequireItxiaMember(role = MemberRoleEnum.ADMIN)
    fun reorderAnnouncement(@RequestBody reorderDto: List<AnnouncementReorderDto>): Response {
        announcementService.reorderAnnouncement(reorderDto)
        return ResponseCode.SUCCESS.withoutPayload()
    }

    /**
     * 修改公告.
     * */
    @PutMapping("/announcement/{aid}")
    @RequireItxiaMember(role = MemberRoleEnum.ADMIN)
    fun modifyAnnouncement(
        @PathVariable aid: String,
        @RequestBody dto: AnnouncementModifyDto
    ): Response {
        announcementService.modifyAnnouncement(aid, dto)
        return ResponseCode.SUCCESS.withoutPayload()
    }

}
