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

    @Value("\${itxia.cookie.secure}")
    private var cookieSecure: Boolean = false

    @Value("\${itxia.cookie.domain}")
    private var cookieDomain: String = ""

    fun invalidCookie(response: HttpServletResponse) {
        setCookie("", 0, response)
    }

    fun assignCookie(cookieValue: String, response: HttpServletResponse) {
        setCookie(cookieValue, cookieMaxAge, response)
    }

    fun getCookieFromRequest(request: HttpServletRequest): Cookie? {
        return request.cookies.firstOrNull { it.name == cookieName }
    }

    fun getCookieMaxAge(): Int {
        return cookieMaxAge
    }


    private fun setCookie(cookieValue: String, maxAge: Int, response: HttpServletResponse) {
        var value = """
            |${cookieName}=${cookieValue};
            |Max-Age=${maxAge};
            |httpOnly;
            |Path=/;
            |SameSite=None
        """.trimMargin().trim()
        if (cookieSecure) {
            value += ";Secure"
        }
        if (cookieDomain.isNotEmpty()) {
            value += ";Domain=${cookieDomain}"
        }
        response.addHeader("Set-Cookie", value)
    }


}
