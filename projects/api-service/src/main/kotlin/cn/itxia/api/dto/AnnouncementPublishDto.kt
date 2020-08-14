package cn.itxia.api.dto

import javax.validation.constraints.NotBlank


data class AnnouncementPublishDto(

        @field:NotBlank
        val type: String,

        @field:NotBlank
        val title: String,

        @field:NotBlank
        val content: String,

        val attachments: List<String>

)