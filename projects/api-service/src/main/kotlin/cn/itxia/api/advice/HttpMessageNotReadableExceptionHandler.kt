package cn.itxia.api.advice

import cn.itxia.api.response.ResponseCode
import cn.itxia.api.util.ResponseUtil
import org.springframework.http.converter.HttpMessageNotReadableException
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler
import javax.servlet.http.HttpServletResponse

@ControllerAdvice
class HttpMessageNotReadableExceptionHandler {

    /**
     * 处理JSON解析错误、参数校验错误.
     * */
    @ExceptionHandler(HttpMessageNotReadableException::class)
    fun httpMessageNotReadableExceptionHandler(exception: HttpMessageNotReadableException, response: HttpServletResponse) {
        ResponseUtil.writeToResponse(
                response, ResponseCode.INCORRECT_PARAM_FORMAT.withPayload("参数校验不正确, 或是json格式错误.")
        )
    }

}
