package cn.itxia.api.model.repository

import cn.itxia.api.model.Reply
import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository

@Repository
interface ReplyRepository : CrudRepository<Reply, String>
