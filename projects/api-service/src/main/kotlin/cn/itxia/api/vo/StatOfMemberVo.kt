package cn.itxia.api.vo

import java.util.*

data class StatOfMemberVo(
    val handlingCount: Int,
    val doneCount: Int,
    val totalCount: Int,

    val updateTime: Date = Date()
)
