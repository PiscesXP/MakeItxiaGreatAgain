package cn.itxia.api.dto

import javax.validation.constraints.Pattern

data class PasswordModifyDto(

        @field:Pattern(regexp = "^.{8,}$")
        val password: String,

        @field:Pattern(regexp = "^.{8,}$")
        val confirmPassword: String,

        val logoutOnOtherDevices:Boolean

)
