package cn.itxia.api.service

import cn.itxia.api.model.ItxiaMember
import cn.itxia.api.model.RequestLog
import cn.itxia.api.model.repository.RequestLogRepository
import org.bson.types.ObjectId
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import javax.servlet.ServletRequest
import javax.servlet.ServletResponse
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

@Service
class RequestLogService {

    @Autowired
    private lateinit var requestLogRepository: RequestLogRepository

    fun logRequest(request: HttpServletRequest,
                   response: HttpServletResponse,
                   itxiaMember: ItxiaMember? = null
    ) {
        val log = RequestLog(
                _id = ObjectId.get().toHexString(),
                uri = request.requestURI,
                method = request.method,
                member = itxiaMember?.toBaseInfoOnly()
        )
        requestLogRepository.save(log)
    }

    fun logRequest(request: ServletRequest,
                   response: ServletResponse,
                   itxiaMember: ItxiaMember? = null
    ) {
        return logRequest(
                request as HttpServletRequest,
                response as HttpServletResponse,
                itxiaMember
        )
    }

}