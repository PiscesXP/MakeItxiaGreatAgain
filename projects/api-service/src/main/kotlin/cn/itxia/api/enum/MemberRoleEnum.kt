package cn.itxia.api.enum

/**
 * IT侠角色.
 * 用于权限控制.(RBAC)
 * */
enum class MemberRoleEnum(val roleName: String, private val authLevel: Int) {
    MEMBER("普通成员", 16),
    ADMIN("管理员", 32),
    SUPER_ADMIN("超级管理员", 64);

    fun isEnoughFor(require: MemberRoleEnum): Boolean {
        return this.authLevel >= require.authLevel
    }

    companion object {
        fun parse(role: String): MemberRoleEnum? {
            val str = role.toUpperCase().trim()
            return values().firstOrNull { it.roleName == str || it.name == str }
        }
    }
}
