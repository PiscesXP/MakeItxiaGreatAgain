package cn.itxia.api.service

import cn.itxia.api.dto.ReplyDto
import cn.itxia.api.model.ItxiaMember
import cn.itxia.api.model.Reply
import cn.itxia.api.model.repository.ReplyRepository
import org.bson.types.ObjectId
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class ReplyService {

    @Autowired
    private lateinit var replyRepository: ReplyRepository

    @Autowired
    private lateinit var attachmentService: AttachmentService

    fun saveReply(replyDto: ReplyDto, itxiaMember: ItxiaMember? = null): Reply {
        val attachmentList = attachmentService.getAttachmentListByIDList(replyDto.attachments)
        val reply = Reply(
            _id = ObjectId.get().toHexString(), content = replyDto.content, attachments = attachmentList,
            postBy = itxiaMember?.toBaseInfoOnly()
        )
        return replyRepository.save(reply)
    }

}
