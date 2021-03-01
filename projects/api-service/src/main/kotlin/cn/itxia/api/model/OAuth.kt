package cn.itxia.api.model

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.DBRef
import org.springframework.data.mongodb.core.mapping.Document

@Document(collection = "oauth")
data class OAuth(
    @Id
    val _id: String,

    @DBRef
    val member: ItxiaMember,

    val qqOpenID: String?
)
