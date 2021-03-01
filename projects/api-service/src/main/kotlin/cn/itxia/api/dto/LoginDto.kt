package cn.itxia.api.dto

import javax.validation.constraints.Pattern

data class LoginDto(
    @field:Pattern(regexp = "^\\S+$") val loginName: String,
    @field:Pattern(regexp = "^.{4,}$") val password: String
)
