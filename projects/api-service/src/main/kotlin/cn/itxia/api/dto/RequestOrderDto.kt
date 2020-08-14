package cn.itxia.api.dto

import javax.validation.constraints.NotBlank

data class RequestOrderDto(

        @field:NotBlank
        val name: String,

        val phone: String,

        val qq: String?,

        val email: String?,

        val os: String,

        val brandModel: String,

        val warranty: String?,

        @field:NotBlank
        val campus: String,

        @field:NotBlank
        val description: String,

        val attachments: List<String>

)