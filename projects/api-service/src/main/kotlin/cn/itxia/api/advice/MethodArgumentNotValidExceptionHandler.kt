package cn.itxia.api.advice

import cn.itxia.api.response.ResponseCode
import cn.itxia.api.util.ResponseUtil
import org.springframework.core.annotation.Order
import org.springframework.web.bind.MethodArgumentNotValidException
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler
import javax.servlet.http.HttpServletResponse

@ControllerAdvice
@Order(101)
class MethodArgumentNotValidExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException::class)
    fun methodArgumentNotValidExceptionHandler(
        exception: MethodArgumentNotValidException,
        response: HttpServletResponse
    ) {
        val message = exception.bindingResult.fieldError?.defaultMessage ?: "参数校验失败"
        ResponseUtil.writeToResponse(
            response, ResponseCode.INCORRECT_PARAM_FORMAT.withPayload(message)
        )
    }

}
