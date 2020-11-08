package cn.itxia.api.enum

/**
 * 社团内部分组.
 * geek/op/web.
 * */
enum class MemberGroupEnum(val groupName: String) {
    GEEK("geek"),
    OP("op"),
    WEB("web");


    companion object {
        fun parse(role: String): MemberGroupEnum? {
            val str = role.toUpperCase().trim()
            return values().firstOrNull { it.groupName == str || it.name == str }
        }
    }
}
