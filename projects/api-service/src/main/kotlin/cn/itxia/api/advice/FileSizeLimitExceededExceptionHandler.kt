package cn.itxia.api.advice

import cn.itxia.api.response.ResponseCode
import cn.itxia.api.util.ResponseUtil
import org.apache.tomcat.util.http.fileupload.impl.FileSizeLimitExceededException
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler
import javax.servlet.http.HttpServletResponse

@ControllerAdvice
class FileSizeLimitExceededExceptionHandler {

    @ExceptionHandler(FileSizeLimitExceededException::class)
    fun fileSizeLimitExceededExceptionHandler(exception: FileSizeLimitExceededException, response: HttpServletResponse) {
        ResponseUtil.writeToResponse(
                response, ResponseCode.REQUEST_SIZE_EXCEEDED.withPayload("附件过大.")
        )
    }

}
