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
        var tags: Iterable<OrderRecordTag.Simple>,

        var title: String,

        var content: String,

        @DBRef
        val attachments: Iterable<Attachment>,

        @DBRef
        val author: ItxiaMember.BaseInfoOnly,

        val createTime: Date = Date(),

        var lastModified: Date? = null,

        @DBRef
        var lastModifiedBy: ItxiaMember.BaseInfoOnly? = null,

        @DBRef
        var starBy: Iterable<ItxiaMember.BaseInfoOnly> = mutableListOf(),

        @DBRef
        var likeBy: Iterable<ItxiaMember.BaseInfoOnly> = mutableListOf(),

        @DBRef
        var comments: Iterable<Reply> = mutableListOf(),

        val modifyHistory: Iterable<OrderRecordHistory> = mutableListOf()
)


data class OrderRecordHistory(
        val modifyTime: Date,

        @DBRef
        val author: ItxiaMember.BaseInfoOnly,

        val title: String,

        val content: String,

        @DBRef
        val tags: Iterable<OrderRecordTag.Simple>
)
