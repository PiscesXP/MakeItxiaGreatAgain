package cn.itxia.api.service

import cn.itxia.api.model.ItxiaMember
import cn.itxia.api.model.RequestLog
import cn.itxia.api.model.repository.RequestLogRepository
import org.bson.types.ObjectId
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class RequestLogService {

    @Autowired
    private lateinit var requestLogRepository: RequestLogRepository

    /**
     * 记录成员请求记录.
     * */
    fun logMemberActivity(
        uri: String,
        method: String,
        member: ItxiaMember
    ) {
        requestLogRepository.save(
            RequestLog(
                _id = ObjectId.get().toHexString(),
                uri = uri,
                method = method,
                member = member.toBaseInfoOnly()
            )
        )
    }

}
