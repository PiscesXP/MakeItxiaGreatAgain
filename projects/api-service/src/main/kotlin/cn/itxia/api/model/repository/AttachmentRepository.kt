package cn.itxia.api.model.repository

import cn.itxia.api.model.Attachment
import org.springframework.data.repository.CrudRepository

interface AttachmentRepository : CrudRepository<Attachment, String> {

    fun findAllBy_idInAndDeletedFalse(_id: List<String>): List<Attachment>

    fun findBy_idAndDeletedFalse(_id: String): Attachment?

}
