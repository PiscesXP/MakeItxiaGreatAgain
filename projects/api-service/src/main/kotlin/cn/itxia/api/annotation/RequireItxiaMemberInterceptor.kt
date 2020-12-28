package cn.itxia.api.annotation

import cn.itxia.api.response.ResponseCode
import cn.itxia.api.service.AuthenticationService
import cn.itxia.api.service.RequestLogService
import cn.itxia.api.util.ResponseUtil
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component
import org.springframework.web.method.HandlerMethod
import org.springframework.web.servlet.HandlerInterceptor
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

@Component
class RequireItxiaMemberInterceptor : HandlerInterceptor {

    @Autowired
    private lateinit var authenticationService: AuthenticationService

    @Autowired
    private lateinit var requestLogService: RequestLogService

    override fun preHandle(request: HttpServletRequest, response: HttpServletResponse, handler: Any): Boolean {
        if (handler !is HandlerMethod) {
            return true
        }
        val method = handler.method
        val annotation = method.getAnnotation(RequireItxiaMember::class.java) ?: return true
        val member = authenticationService.getMemberFromRequest(request)

        return when (true) {
            member == null -> {
                ResponseUtil.writeToResponse(response, ResponseCode.UNAUTHENTICATED.withPayload("请先登录."))
                false
            }
            member.role.isEnoughFor(annotation.role) -> {
                GlobalScope.launch {
                    requestLogService.logMemberActivity(
                        uri = request.requestURI,
                        method = request.method,
                        member = member
                    )
                }
                true
            }
            else -> {
                ResponseUtil.writeToResponse(response, ResponseCode.UNAUTHORIZED.withPayload("权限不足."))
                false
            }
        }
    }

}
