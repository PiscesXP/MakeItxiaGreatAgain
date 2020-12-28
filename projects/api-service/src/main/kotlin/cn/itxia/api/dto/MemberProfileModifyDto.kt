package cn.itxia.api.dto

data class MemberProfileModifyDto(
    val campus: String,

    val group: String,

    val email: String?,

    val emailNotification: List<String>?
)
