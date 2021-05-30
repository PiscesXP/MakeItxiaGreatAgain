package cn.itxia.api.vo

import java.util.*

data class ChartsStatVo(
    val orderCountsByDay: OrderCountsByDate,
    val orderCountsByMonth: OrderCountsByDate,
    val expTags: ExpTags,
    val updateTime: Date = Date(),
) {
    data class OrderCountsByDate(
        val dateList: MutableList<String> = mutableListOf(),
        val guLou: MutableList<Int> = mutableListOf(),
        val xianLin: MutableList<Int> = mutableListOf(),
    ) {
        fun append(
            date: String,
            guLouCount: Int,
            xianLinCount: Int,
        ) {
            dateList.add(date)
            guLou.add(guLouCount)
            xianLin.add(xianLinCount)
        }
    }

    data class ExpTags(
        val tagNameList: List<String>,
        val tagCountList: List<Int>,
    )
}
