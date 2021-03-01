package cn.itxia.api.model

import cn.itxia.api.enum.RedeemCodeTypeEnum
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.DBRef
import org.springframework.data.mongodb.core.mapping.Document
import java.util.*

@Document("redeem_code")
data class RedeemCode(

    @Id
    val _id: String,

    val type: RedeemCodeTypeEnum,

    @DBRef
    val provider: ItxiaMember,

    val redeemCode: String,

    /**
     * 是否已经用过
     * */
    val hasRedeemed: Boolean,

    @DBRef
    var receiver: ItxiaMember? = null,

    val createTime: Date = Date()
)
