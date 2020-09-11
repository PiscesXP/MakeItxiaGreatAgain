package cn.itxia.api.model.repository

import cn.itxia.api.model.ItxiaMember
import org.bson.types.ObjectId
import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface ItxiaMemberRepository : CrudRepository<ItxiaMember, String> {

    fun findByLoginName(loginName: String): ItxiaMember?

    override fun findAll(): List<ItxiaMember>

}
