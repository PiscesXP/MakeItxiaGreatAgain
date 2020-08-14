package cn.itxia.api.enum

/**
 * 预约单公告类型.
 * */
enum class AnnouncementTypeEnum(private val typeName: String) {
    INTERNAL("内部公告"),
    EXTERNAL("外部公告");

    companion object {
        fun parse(type: String): AnnouncementTypeEnum? {
            val str = type.toUpperCase().trim()
            return values().firstOrNull { it.typeName == str || it.name == str }
        }
    }
}
