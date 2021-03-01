package cn.itxia.api.model.repository

import cn.itxia.api.model.ItxiaMember
import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository

@Repository
interface ItxiaMemberRepository : CrudRepository<ItxiaMember, String> {

    fun findByLoginName(loginName: String): ItxiaMember?

    override fun findAll(): List<ItxiaMember>

    fun existsByQqAndDisabledFalse(qq: String): Boolean

}
