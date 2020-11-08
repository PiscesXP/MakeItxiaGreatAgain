package cn.itxia.api.model.repository

import cn.itxia.api.model.OrderRecordTag
import org.springframework.data.repository.CrudRepository

interface OrderRecordTagRepository : CrudRepository<OrderRecordTag, String> {

    fun existsByName(name: String): Boolean

}
