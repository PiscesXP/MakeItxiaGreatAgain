package cn.itxia.api.model.repository

import cn.itxia.api.model.ItxiaMember
import cn.itxia.api.model.Session
import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository

@Repository
interface SessionRepository : CrudRepository<Session, String> {

    fun findByValue(sessionValue: String): Session?

    fun deleteAllByMember(member: ItxiaMember.BaseInfoOnly)

    fun findAllByMember(member: ItxiaMember.BaseInfoOnly): Iterable<Session>

}
