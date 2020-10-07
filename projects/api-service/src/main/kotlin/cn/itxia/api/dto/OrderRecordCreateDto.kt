package cn.itxia.api.dto

data class OrderRecordCreateDto(
        val order: String,

        val tags: List<String>,

        val title: String,

        val content: String,

        val attachments: List<String>
)
