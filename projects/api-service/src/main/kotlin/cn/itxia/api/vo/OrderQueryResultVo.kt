package cn.itxia.api.vo

import cn.itxia.api.model.Order

data class OrderQueryResultVo(
        val pagination: Pagination,
        val data: List<Order>
) {
    data class Pagination(
            val currentPage: Int,
            val totalCount: Int,
            val pageSize: Int
    )
}