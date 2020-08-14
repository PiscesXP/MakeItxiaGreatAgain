package cn.itxia.api.advice

import cn.itxia.api.response.ResponseCode
import cn.itxia.api.util.ResponseUtil
import org.springframework.web.bind.MethodArgumentNotValidException
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler
import javax.servlet.http.HttpServletResponse

@ControllerAdvice
class MethodArgumentNotValidExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException::class)
    fun methodArgumentNotValidExceptionHandler(exception: MethodArgumentNotValidException, response: HttpServletResponse) {
        ResponseUtil.writeToResponse(
                response, ResponseCode.INCORRECT_PARAM_FORMAT.withPayload("参数校验不正确.")
        )
    }

}
