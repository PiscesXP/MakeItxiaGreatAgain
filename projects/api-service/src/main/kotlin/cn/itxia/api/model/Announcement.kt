package cn.itxia.api.model

import cn.itxia.api.enum.AnnouncementTypeEnum
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.DBRef
import java.util.*

data class Announcement(
        @Id
        val _id: String,

        val type: AnnouncementTypeEnum,

        val title: String,

        val content: String,
        @DBRef
        val attachments: List<Attachment>,

        val createTime: Date = Date(),


        @DBRef
        val postBy: ItxiaMember.BaseInfoOnly,

        @DBRef
        var comments: List<Reply>,

        @DBRef
        var likedBy: List<ItxiaMember.BaseInfoOnly>
)
