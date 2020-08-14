package cn.itxia.api.model.repository

import cn.itxia.api.model.ItxiaMember
import cn.itxia.api.model.OAuth
import org.springframework.data.repository.CrudRepository

interface OAuthRepository : CrudRepository<OAuth, String> {

    fun findByQqOpenID(qqOpenID: String): OAuth?

    fun findByMember(member: ItxiaMember):OAuth?

    fun deleteAllByMember(member: ItxiaMember)

}