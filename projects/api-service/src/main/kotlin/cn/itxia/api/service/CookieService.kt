package cn.itxia.api.service

import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import javax.servlet.http.Cookie
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

@Service
class CookieService {

    @Value("\${itxia.cookie.name}")
    private lateinit var cookieName: String

    @Value("\${itxia.cookie.maxAge}")
    private var cookieMaxAge: Int = 1

    fun invalidCookie(request: HttpServletRequest, response: HttpServletResponse) {
        setCookie("", 0, request, response)
    }

    fun assignCookie(cookieValue: String, request: HttpServletRequest, response: HttpServletResponse) {
        setCookie(cookieValue, cookieMaxAge, request, response)
    }

    fun getCookieFromRequest(request: HttpServletRequest): Cookie? {
        return request.cookies.firstOrNull { it.name == cookieName }
    }

    fun getCookieMaxAge(): Int {
        return cookieMaxAge
    }

    private fun setCookie(
        cookieValue: String,
        maxAge: Int,
        request: HttpServletRequest,
        response: HttpServletResponse
    ) {
        var value = """
            |${cookieName}=${cookieValue};
            |Max-Age=${maxAge};
            |httpOnly;
            |Path=/api;
            |SameSite=Strict
        """.trimMargin().trim()

        val origin = request.getHeader("itxia-from")
        if ((!origin.isNullOrEmpty()) && origin.split("//").size == 2) {

            //Secure field
            val protocol = origin.split("//")[0]
            if (protocol == "https:") {
                value += ";Secure"
            }

            //Domain field
            val host = origin.split("//")[1]
            if (isOurDomain(host)) {
                value += ";Domain=${host}"
            } else if (Regex("^localhost:\\d+$").matches(host)) {
                value += ";Domain=localhost"
            }
        }

        value = value.replace("\n", "")
        response.addHeader("Set-Cookie", value)
    }

    private fun isOurDomain(domain: String): Boolean {
        val domainList = listOf("nju.itxia.cn", "itxia.site", "api.itxia.cn")
        return domainList.contains(domain)
    }

}
