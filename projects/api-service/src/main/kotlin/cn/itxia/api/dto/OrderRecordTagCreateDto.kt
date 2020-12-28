package cn.itxia.api.dto

import javax.validation.constraints.Pattern

data class OrderRecordTagCreateDto(
    @field:Pattern(regexp = "^\\S+$")
    val name: String
)
