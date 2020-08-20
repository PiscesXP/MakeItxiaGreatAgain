package cn.itxia.api.model

import cn.itxia.api.enum.CampusEnum
import cn.itxia.api.enum.MemberRoleEnum
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.index.Indexed
import org.springframework.data.mongodb.core.mapping.DBRef
import org.springframework.data.mongodb.core.mapping.Document
import java.util.*

@Document(collection = "users")
data class ItxiaMember(

        @Id
        val _id: String,

        @Indexed(unique = true)
        val loginName: String,

        val realName: String,

        var password: String,

        var campus: CampusEnum,

        var role: MemberRoleEnum,

        var disabled: Boolean,

        var joinDate: Date,

        var requirePasswordReset: Boolean,

        @DBRef
        var inviteBy: BaseInfoOnly?,

        var lastLogin: Date? = null,

        var email: String? = null,

        var emailNotification: EmailNotificationSetting = EmailNotificationSetting()
) {
    @Document(collection = "users")
    data class BaseInfoOnly(
            @Id
            val _id: String,
            val realName: String
    )

    fun toBaseInfoOnly(): BaseInfoOnly {
        return BaseInfoOnly(this._id, this.realName)
    }

    fun removeSensitiveFields(): ItxiaMember {
        return this.copy(password = "")
    }
}

data class EmailNotificationSetting(
        var onMyCampusHasNewOrder: Boolean = false,
        var onMyOrderHasNewReply: Boolean = false
)

