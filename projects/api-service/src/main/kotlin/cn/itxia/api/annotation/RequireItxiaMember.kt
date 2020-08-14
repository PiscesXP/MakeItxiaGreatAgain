package cn.itxia.api.annotation

import cn.itxia.api.enum.MemberRoleEnum

/**
 * 需要IT侠认证.
 * 还可设置权限,权限不足会直接返回.
 * */
@Target(AnnotationTarget.FUNCTION)
@Retention(AnnotationRetention.RUNTIME)
annotation class RequireItxiaMember(
        val role: MemberRoleEnum = MemberRoleEnum.MEMBER
)
