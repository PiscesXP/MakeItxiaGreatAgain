package cn.itxia.api.enum

/**
 * 预约单状态.
 * */
enum class OrderStatusEnum(private val statusName: String) {
    PENDING("等待处理"),
    HANDLING("正在处理"),
    DONE("已完成"),
    CANCELED("已取消");

    companion object {
        fun parse(status: String): OrderStatusEnum? {
            val str = status.toUpperCase().trim()
            return values().firstOrNull { it.statusName == str || it.name == str }
        }
    }
}
