package cn.itxia.api.enum

/**
 * 校区参数.
 * 啥时候开新校区呢...
 * */
enum class CampusEnum(private val campusName: String) {
    XIANLIN("仙林"),
    GULOU("鼓楼");

    companion object {
        fun parse(campus: String): CampusEnum? {
            val str = campus.toUpperCase().trim()
            return values().firstOrNull { it.campusName == str || it.name == str }
        }
    }
}
