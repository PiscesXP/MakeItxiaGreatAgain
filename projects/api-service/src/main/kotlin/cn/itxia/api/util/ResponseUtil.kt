package cn.itxia.api.util

import com.fasterxml.jackson.databind.ObjectMapper
import javax.servlet.ServletResponse
import javax.servlet.http.HttpServletResponse

/**
 * 方便地将responseBody写入servletResponse.
 * 用在filter和exceptionHandler.
 * */
class ResponseUtil {

    companion object {

        private val mapper = ObjectMapper()

        fun writeToResponse(httpServletResponse: HttpServletResponse, responseBody: Any) {
            httpServletResponse.addHeader("content-type", "application/json; charset=utf-8")
            val str = mapper.writeValueAsString(responseBody)
            httpServletResponse.writer.print(str)
        }

        fun writeToResponse(servletResponse: ServletResponse, responseBody: Any) {
            writeToResponse(servletResponse as HttpServletResponse, responseBody)
        }

    }

}