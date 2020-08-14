package cn.itxia.api.enum

/**
 * 预约单动作.
 * */
enum class OrderActionEnum {
    /**
     * 接单.
     * */
    ACCEPT,

    /**
     * 放回.
     * */
    GIVEUP,

    /**
     * 完成预约单.
     * */
    DONE,

    /**
     * 删除预约单.
     * */
    DELETE;

    companion object {
        fun parse(action: String): OrderActionEnum? {
            val str = action.toUpperCase().trim()
            return values().firstOrNull { it.name == str }
        }
    }
}
