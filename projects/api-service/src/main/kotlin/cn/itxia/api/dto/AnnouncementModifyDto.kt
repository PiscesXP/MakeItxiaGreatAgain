package cn.itxia.api.dto

import javax.validation.constraints.NotBlank


data class AnnouncementModifyDto(

        @field:NotBlank
        val title: String,

        @field:NotBlank
        val content: String

)