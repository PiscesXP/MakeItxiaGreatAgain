package cn.itxia.api.util

import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import org.springframework.data.mongodb.core.MongoTemplate
import org.springframework.data.mongodb.core.query.Criteria
import org.springframework.data.mongodb.core.query.Query

class PageRequestHelper {
    companion object {

        fun <T> getPaginationResult(
                page: Int?,
                size: Int?,
                criteria: Criteria,
                sort: Sort? = null,
                entityClass: Class<T>,
                mongoTemplate: MongoTemplate,
                defaultPage: Int = 1,
                defaultSize: Int = 20
        ): PaginationResult<T> {
            val requestPage = page ?: defaultPage
            val requestSize = size ?: defaultSize
            val totalCount = mongoTemplate.count(Query.query(criteria), entityClass).toInt()

            //最大可能的页数
            var maxPossiblePageCount = totalCount / requestSize + 1
            if (totalCount % requestSize == 0) {
                --maxPossiblePageCount
            }
            if (maxPossiblePageCount < 1) {
                maxPossiblePageCount = 1
            }
            val currentPage = if (requestPage < maxPossiblePageCount) requestPage else maxPossiblePageCount

            val pageRequest = PageRequest.of(currentPage - 1, requestSize)

            val query = Query.query(criteria).with(pageRequest)

            if (sort != null) {
                query.with(sort)
            }

            val data = mongoTemplate.find(
                    query,
                    entityClass
            )

            return PaginationResult(
                    pagination = PaginationResult.Pagination(
                            current = currentPage,
                            total = totalCount,
                            pageSize = requestSize
                    ),
                    data = data
            )
        }

    }
}

data class PaginationResult<T>(
        val pagination: Pagination,
        val data: List<T>
) {
    data class Pagination(
            //当前页码，从1开始数
            val current: Int,
            //数据总数
            val total: Int,
            //每页条数
            val pageSize: Int
    )
}
