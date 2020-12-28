package cn.itxia.api.advice

import cn.itxia.api.response.ResponseCode
import cn.itxia.api.util.ResponseUtil
import org.springframework.core.annotation.Order
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler
import javax.servlet.http.HttpServletResponse

@ControllerAdvice
@Order(65535)
class OtherExceptionHandler {

    @ExceptionHandler(Exception::class)
    fun otherExceptionHandler(exception: Exception, response: HttpServletResponse) {
        ResponseUtil.writeToResponse(
            response, ResponseCode.UNKNOWN_ERROR.withPayload("未知错误")
        )
    }

}
