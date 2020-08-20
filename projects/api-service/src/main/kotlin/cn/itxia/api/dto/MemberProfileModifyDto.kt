package cn.itxia.api.dto

data class MemberProfileModifyDto(
        val campus: String,
        val email: String?,
        val emailNotification: List<String>?
)
