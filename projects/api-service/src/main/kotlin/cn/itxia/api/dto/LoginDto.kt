package cn.itxia.api.dto

import javax.validation.constraints.Pattern

data class LoginDto(
        @field:Pattern(regexp = "^\\w{4,16}$") val loginName: String,
        @field:Pattern(regexp = "^.{4,16}$") val password: String
)
