package cn.itxia.api.vo

import java.util.*

data class StatOfAllVo(
    val pendingCount: Int,
    val handlingCount: Int,
    val doneCount: Int,

    val backlogXianlin: Int,
    val backlogGulou: Int,

    val updateTime: Date = Date()
)
