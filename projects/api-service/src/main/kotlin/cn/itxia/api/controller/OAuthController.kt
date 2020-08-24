package cn.itxia.api.controller

import cn.itxia.api.annotation.CurrentItxiaMember
import cn.itxia.api.annotation.RequireItxiaMember
import cn.itxia.api.dto.QQOAuthDto
import cn.itxia.api.model.ItxiaMember
import cn.itxia.api.response.Response
import cn.itxia.api.response.ResponseCode
import cn.itxia.api.service.OAuthService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

@RestController
class OAuthController {

    @Autowired
    private lateinit var oAuthService: OAuthService

    /**
     * 重定向到OAuth网页页面.
     * 好不容易过审核了，担心再改审核不过，就重定向一次好了.
     *
     * (审核的url没含有.html，
     * spring的静态资源不把没后缀的它当html文档看...
     * 因此请求得到的content type不是html
     * 就被浏览器认为是普通文件)
     * */
    @GetMapping("/oauth/qq")
    fun qq(response: HttpServletResponse) {
        response.sendRedirect("/oauth/qq.html")
    }

    /**
     * 未登录：通过OAuth登录.
     * 已登录：绑定QQ OAuth.
     * */
    @PostMapping("/oauth/link/qq")
    fun qqOAuthLogin(@RequestBody qqoAuthDto: QQOAuthDto,
                     @CurrentItxiaMember itxiaMember: ItxiaMember?,
                     httpServletRequest: HttpServletRequest,
                     httpServletResponse: HttpServletResponse): Response {
        return if (itxiaMember == null) {
            oAuthService.qqOAuthLogin(qqoAuthDto.accessToken, httpServletRequest, httpServletResponse)
        } else {
            oAuthService.bindQQOAuth(qqoAuthDto.accessToken, itxiaMember)
        }
    }

    /**
     * 检查是否已绑定QQ OAuth.
     * */
    @GetMapping("/oauth/link/qq")
    @RequireItxiaMember
    fun checkIfBingQQOAuth(@CurrentItxiaMember itxiaMember: ItxiaMember): Response {
        return when (true) {
            oAuthService.checkIfBoundQQOAuth(itxiaMember) -> ResponseCode.SUCCESS.withPayload("已绑定QQ OAuth")
            else -> ResponseCode.NO_OAUTH_ID_FOUND.withPayload("未绑定QQ OAuth")
        }
    }

}
