package cn.itxia.api.model

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.DBRef
import org.springframework.data.mongodb.core.mapping.Document
import java.util.*

private const val COLLECTION_NAME = "order_record"

@Document(COLLECTION_NAME)
data class OrderRecord(
        @Id
        val _id: String,

        @DBRef
        val order: Order,

        @DBRef
        val tags: List<OrderRecordTag.Simple>,

        val title: String,

        val content: String,

        @DBRef
        val attachments: List<Attachment>,

        @DBRef
        val author: ItxiaMember.BaseInfoOnly,

        val createTime: Date = Date(),

        val lastModified: Date? = null,

        @DBRef
        val lastModifiedBy: ItxiaMember.BaseInfoOnly? = null,

        @DBRef
        val starBy: List<ItxiaMember.BaseInfoOnly> = listOf(),

        @DBRef
        val likeBy: List<ItxiaMember.BaseInfoOnly> = listOf(),

        @DBRef
        val comments: List<Reply> = listOf(),

        val modifyHistory: List<OrderRecordHistory> = listOf()
)


data class OrderRecordHistory(
        val modifyTime: Date,
        val author: ItxiaMember.BaseInfoOnly,
        val createTime: Date,
        val title: String,
        val content: String,
        val tags: List<OrderRecordTag.Simple>
)
