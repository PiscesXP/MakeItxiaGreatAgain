package cn.itxia.api.model

import cn.itxia.api.enum.CampusEnum
import cn.itxia.api.enum.OrderStatusEnum
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.DBRef
import org.springframework.data.mongodb.core.mapping.Document
import java.util.*

@Document(collection = "orders")
data class Order(
        @Id
        val _id: String,

        val name: String,

        val phone: String,

        val qq: String?,

        val email: String?,

        val acceptEmailNotification: Boolean = false,

        val os: String,

        val brandModel: String,

        val warranty: String?,

        val campus: CampusEnum,

        val description: String,

        val createTime: Date = Date(),

        /**
         * 正在处理的it侠.
         * */
        @DBRef
        var handler: ItxiaMember.BaseInfoOnly? = null,

        var deleted: Boolean = false,

        /**
         * 预约单状态.
         * */
        var status: OrderStatusEnum = OrderStatusEnum.PENDING,

        @DBRef
        val reply: MutableList<Reply> = mutableListOf(),

        @DBRef
        val discuss: MutableList<Reply> = mutableListOf(),

        @DBRef
        val attachments: List<Attachment> = listOf()

)
