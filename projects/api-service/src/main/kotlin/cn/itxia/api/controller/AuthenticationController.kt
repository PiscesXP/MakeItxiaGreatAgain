package cn.itxia.api.controller

import cn.itxia.api.annotation.CurrentItxiaMember
import cn.itxia.api.annotation.RequireItxiaMember
import cn.itxia.api.dto.LoginDto
import cn.itxia.api.model.ItxiaMember
import cn.itxia.api.response.Response
import cn.itxia.api.response.ResponseCode
import cn.itxia.api.service.AuthenticationService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

/**
 * 账户认证相关.
 * */
@RestController
class AuthenticationController {

    @Autowired
    private lateinit var authenticationService: AuthenticationService


    @PostMapping("/login")
    fun login(request: HttpServletRequest, response: HttpServletResponse, @RequestBody @Validated loginDto: LoginDto): Response {
        return authenticationService.loginByPassword(loginDto.loginName, loginDto.password, request, response)
    }

    @GetMapping("/logout")
    fun logout(request: HttpServletRequest, response: HttpServletResponse): Response {
        return authenticationService.logout(request, response)
    }

    @GetMapping("/whoami")
    @RequireItxiaMember
    fun whoami(@CurrentItxiaMember itxiaMember: ItxiaMember): Response {
        return ResponseCode.SUCCESS.withPayload(itxiaMember.removeSensitiveFields())
    }

}
