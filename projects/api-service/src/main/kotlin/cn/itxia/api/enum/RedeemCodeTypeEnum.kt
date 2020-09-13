package cn.itxia.api.enum

/**
 * 兑换码类型.
 * */
enum class RedeemCodeTypeEnum(private val typeName: String) {
    RECRUIT("邀请加入");

    companion object {
        fun parse(type: String): RedeemCodeTypeEnum? {
            val str = type.toUpperCase().trim()
            return values().firstOrNull { it.typeName == str || it.name == str }
        }
    }
}
