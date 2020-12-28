package cn.itxia.api.service

import cn.itxia.api.model.RequestLog
import cn.itxia.api.model.repository.RequestLogRepository
import org.bson.types.ObjectId
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import javax.servlet.ServletRequest
import javax.servlet.ServletResponse
import javax.servlet.http.HttpServletRequest

@Service
class RequestLogService {

    @Autowired
    private lateinit var requestLogRepository: RequestLogRepository

    @Autowired
    private lateinit var authenticationService: AuthenticationService

    /**
     * 记录成员请求记录.
     * */
    fun logMemberActivity(request: ServletRequest, response: ServletResponse) {
        val member = authenticationService.getMemberFromRequest(request as HttpServletRequest) ?: return
        requestLogRepository.save(
            RequestLog(
                _id = ObjectId.get().toHexString(),
                uri = request.requestURI,
                method = request.method,
                member = member.toBaseInfoOnly()
            )
        )
    }

}
