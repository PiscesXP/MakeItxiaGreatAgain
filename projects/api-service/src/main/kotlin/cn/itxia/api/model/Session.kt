package cn.itxia.api.model

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.index.Indexed
import org.springframework.data.mongodb.core.mapping.DBRef
import org.springframework.data.mongodb.core.mapping.Document
import java.util.*

@Document(collection = "session")
data class Session(

        @Id
        val _id: String,

        @Indexed
        val value: String,

        @Indexed
        @DBRef
        val member: ItxiaMember.BaseInfoOnly,

        val expiresAfter: Date
)