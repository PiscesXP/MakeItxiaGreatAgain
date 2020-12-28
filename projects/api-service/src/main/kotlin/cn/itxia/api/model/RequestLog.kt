package cn.itxia.api.model

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document

@Document(collection = "request_log")
data class RequestLog(
    @Id
    val _id: String,

    val uri: String,

    val method: String,

    val member: ItxiaMember.BaseInfoOnly? = null

)
