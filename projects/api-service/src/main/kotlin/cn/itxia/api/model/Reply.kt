package cn.itxia.api.model

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.DBRef
import org.springframework.data.mongodb.core.mapping.Document
import java.util.*

@Document(collection = "reply")
data class Reply(
        @Id
        val _id: String,

        val content: String,

        @DBRef
        val attachments: List<Attachment>,

        @DBRef
        val postBy: ItxiaMember.BaseInfoOnly?,

        val createTime: Date = Date()
)