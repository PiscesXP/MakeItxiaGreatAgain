package cn.itxia.api.service

import cn.itxia.api.dto.AnnouncementPublishDto
import cn.itxia.api.dto.ReplyDto
import cn.itxia.api.enum.AnnouncementTypeEnum
import cn.itxia.api.model.Announcement
import cn.itxia.api.model.ItxiaMember
import cn.itxia.api.model.repository.AnnouncementRepository
import org.bson.types.ObjectId
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.util.*

/**
 * 公告相关.
 * */
@Service
class AnnouncementService {

    @Autowired
    private lateinit var announcementRepository: AnnouncementRepository

    @Autowired
    private lateinit var attachmentService: AttachmentService

    @Autowired
    private lateinit var replyService: ReplyService

    /**
     * 获取内部公告.
     * (后台系统)
     * @return 公告列表
     * */
    fun getInternalAnnouncements(): List<Announcement> {
        return announcementRepository.findByType(AnnouncementTypeEnum.INTERNAL)
    }

    /**
     * 获取外部公告.
     * (预约系统)
     * @return 公告列表
     * */
    fun getExternalAnnouncements(): List<Announcement> {
        return announcementRepository.findByType(AnnouncementTypeEnum.EXTERNAL)
    }

    /**
     * 发布公告.
     * @return 发布成功的公告. null表示参数有误.
     * */
    fun publishAnnouncement(dto: AnnouncementPublishDto, postByMember: ItxiaMember): Announcement? {
        //附件列表
        val attachmentList = attachmentService.getAttachmentListByIDList(dto.attachments)

        val announcement = AnnouncementTypeEnum.parse(dto.type)?.let {
            Announcement(
                    _id = ObjectId.get().toHexString(),
                    type = it,
                    title = dto.title,
                    content = dto.content,
                    attachments = attachmentList,
                    createTime = Date(),
                    postBy = postByMember.toBaseInfoOnly(),
                    comments = emptyList(),
                    likedBy = emptyList()
            )
        }
        return announcement?.let { announcementRepository.save(announcement) }
    }

    /**
     * 点赞或取消赞.
     * */
    fun likeOrUnlike(announcementID: String, itxiaMember: ItxiaMember, isLike: Boolean) {
        val announcement = findAnnouncementByID(announcementID)
                ?: return
        val list = announcement.likedBy.toMutableList()
        if (isLike) {
            //点赞
            val likedBefore = list.any { likedMember -> likedMember._id == itxiaMember._id }
            if (!likedBefore) {
                list.add(itxiaMember.toBaseInfoOnly())
            } else {
                //之前赞过了
                return
            }
        } else {
            //取消赞
            list.removeIf { member -> member._id == itxiaMember._id }
        }
        announcement.likedBy = list
        announcementRepository.save(announcement)
    }

    /**
     * 评论.
     * @return true if 评论成功
     * */
    fun comment(announcementID: String, replyDto: ReplyDto, itxiaMember: ItxiaMember): Boolean {
        val announcement = findAnnouncementByID(announcementID)
                ?: return false
        val list = announcement.comments.toMutableList()
        val reply = replyService.saveReply(replyDto, itxiaMember)
        list.add(reply)
        announcement.comments = list
        announcementRepository.save(announcement)
        return true
    }

    private fun findAnnouncementByID(announcementID: String): Announcement? {
        val optional = announcementRepository.findById(announcementID)
        if (optional.isPresent) {
            return optional.get()
        }
        return null
    }

}
