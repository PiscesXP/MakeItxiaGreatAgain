package cn.itxia.api.dto

import javax.validation.constraints.Pattern

data class PasswordModifyDto(

        @Pattern(regexp = "^,{8,16}$")
        val newPassword: String

)