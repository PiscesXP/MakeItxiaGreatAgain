package cn.itxia.api.model

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.DBRef
import java.util.*

data class Attachment(

    @Id
    val _id: String,

    val fileName: String,

    val size: Long,

    val mimeType: String?,

    val md5: String,

    @DBRef
    val uploadBy: ItxiaMember.BaseInfoOnly?,

    val uploadTime: Date,

    val deleted: Boolean
)
