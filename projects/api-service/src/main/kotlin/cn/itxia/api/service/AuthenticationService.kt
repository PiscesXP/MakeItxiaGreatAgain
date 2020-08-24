package cn.itxia.api.service

import cn.itxia.api.model.ItxiaMember
import cn.itxia.api.model.Session
import cn.itxia.api.model.repository.ItxiaMemberRepository
import cn.itxia.api.model.repository.SessionRepository
import cn.itxia.api.response.Response
import cn.itxia.api.response.ResponseCode
import cn.itxia.api.util.PasswordUtil
import org.apache.commons.lang3.RandomStringUtils
import org.bson.types.ObjectId
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.util.*
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

/**
 * 认证权限、识别当前用户、处理登录登出、修改密码.
 * */
@Service
class AuthenticationService {

    @Autowired
    private lateinit var memberService: MemberService

    @Autowired
    private lateinit var cookieService: CookieService

    @Autowired
    private lateinit var itxiaMemberRepository: ItxiaMemberRepository

    @Autowired
    private lateinit var sessionRepository: SessionRepository

    /**
     * 通过账号密码登录.
     * 若登录成功，会给response添加token.
     * @return 验证是否成功.
     * */
    fun loginByPassword(loginName: String, password: String, httpServletRequest: HttpServletRequest, httpServletResponse: HttpServletResponse): Response {
        val member = itxiaMemberRepository.findByLoginName(loginName)
                ?: return ResponseCode.INCORRECT_PASSWORD.withoutPayload()
        val verifyResult = PasswordUtil.verify(password, member.password)
        if (verifyResult) {
            if (member.disabled) {
                //检查是否已禁用
                return ResponseCode.ACCOUNT_NOT_ENABLE.withoutPayload()
            }
            this.login(member, httpServletRequest, httpServletResponse)
            return ResponseCode.SUCCESS.withPayload("登录成功.")
        }
        return ResponseCode.INCORRECT_PASSWORD.withPayload("登录失败.")
    }

    /**
     * 直接授予登录.
     * */
    fun login(member: ItxiaMember, httpServletRequest: HttpServletRequest, httpServletResponse: HttpServletResponse) {
        val sessionValue = this.generateSessionValue()
        //保存session到数据库
        val session = Session(
                _id = ObjectId.get().toHexString(),
                value = sessionValue,
                member = member.toBaseInfoOnly(),
                expiresAfter = Date(Date().time + cookieService.getCookieMaxAge() * 1000)
        )
        sessionRepository.save(session)

        //将session存储到cookie中
        cookieService.assignCookie(sessionValue, httpServletRequest, httpServletResponse)

        //记录最后登录时间
        memberService.recordLastLogin(member)
    }

    /**
     * 退出登录.
     * 会将cookie清空.
     * */
    fun logout(request: HttpServletRequest, response: HttpServletResponse): Response {
        cookieService.invalidCookie(request, response)
        //删除数据库中的session
        val session = getSessionFromRequest(request)
        if (session != null) {
            sessionRepository.delete(session)
        }
        return ResponseCode.SUCCESS.withPayload("已退出登录.")
    }


    /**
     * 验证该请求是否已认证(authenticated).
     * @return true if 已认证.
     * */
    fun isAuthenticated(request: HttpServletRequest): Boolean {
        val session = getSessionFromRequest(request) ?: return false
        if (session.expiresAfter.before(Date())) {
            //此session已经过期
            sessionRepository.delete(session)
            return false
        }
        return true
    }

    /**
     * 解析当前请求的member.
     * @return 当前请求的it侠. 若未登录则返回null.
     * */
    fun getMemberFromRequest(request: HttpServletRequest): ItxiaMember? {
        val session = getSessionFromRequest(request) ?: return null
        val memberID = session.member._id
        val optional = itxiaMemberRepository.findById(memberID)
        if (optional.isPresent) {
            return optional.get()
        }
        return null
    }

    /**
     * 从请求中获取对应的session.
     * @return 当前请求的session model. 若没有session则为null.
     * */
    private fun getSessionFromRequest(request: HttpServletRequest): Session? {
        if (request.cookies == null) {
            return null
        }
        val sessionCookie = cookieService.getCookieFromRequest(request)
                ?: return null
        val sessionValue = sessionCookie.value
        return sessionRepository.findByValue(sessionValue)
    }

    /**
     * 生成随机字符串，作为session value用.
     * */
    private fun generateSessionValue(): String {
        return RandomStringUtils.randomAlphanumeric(32)
    }

}
