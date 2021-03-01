package cn.itxia.api.model

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.DBRef
import org.springframework.data.mongodb.core.mapping.Document
import java.util.*

private const val COLLECTION_NAME = "order_record_tag"

@Document(COLLECTION_NAME)
data class OrderRecordTag(
    @Id
    val _id: String,

    //标签名称
    val name: String,

    //创建tag的it侠
    @DBRef
    val createBy: ItxiaMember.BaseInfoOnly,

    //创建时间
    val createTime: Date = Date(),

    //被预约单记录引用次数
    var referCount: Int = 0
) {
    @Document(COLLECTION_NAME)
    data class Simple(
        @Id
        val _id: String,

        val name: String
    )

    fun toSimple(): Simple {
        return Simple(
            _id = this._id,
            name = this.name
        )
    }
}
