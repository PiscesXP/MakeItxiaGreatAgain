package cn.itxia.api.dto

data class OrderReplyDto(

    val content: String,

    val attachments: List<String>,

    val sendEmailNotification: Boolean?
)
