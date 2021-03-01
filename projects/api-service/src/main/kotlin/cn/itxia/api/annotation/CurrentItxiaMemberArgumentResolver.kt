package cn.itxia.api.annotation

import cn.itxia.api.model.ItxiaMember
import cn.itxia.api.service.AuthenticationService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.core.MethodParameter
import org.springframework.stereotype.Component
import org.springframework.web.bind.support.WebDataBinderFactory
import org.springframework.web.context.request.NativeWebRequest
import org.springframework.web.method.support.HandlerMethodArgumentResolver
import org.springframework.web.method.support.ModelAndViewContainer
import javax.servlet.http.HttpServletRequest

/**
 * 将@CurrentItxiaMember 参数解析为ItxiaMember 实体.
 * */
@Component
class CurrentItxiaMemberArgumentResolver : HandlerMethodArgumentResolver {

    @Autowired
    private lateinit var authenticationService: AuthenticationService

    override fun supportsParameter(parameter: MethodParameter): Boolean {
        return parameter.parameterType.isAssignableFrom(ItxiaMember::class.java)
                && parameter.hasParameterAnnotation(CurrentItxiaMember::class.java)
    }

    override fun resolveArgument(
        parameter: MethodParameter,
        p1: ModelAndViewContainer?,
        nativeWebRequest: NativeWebRequest,
        p3: WebDataBinderFactory?
    ): Any? {
        val httpServletRequest = nativeWebRequest.getNativeRequest(HttpServletRequest::class.java) ?: return null
        return authenticationService.getMemberFromRequest(httpServletRequest)
    }
}
