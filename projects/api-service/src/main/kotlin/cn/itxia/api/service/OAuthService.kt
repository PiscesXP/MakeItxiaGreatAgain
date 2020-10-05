package cn.itxia.api.service

import cn.itxia.api.model.ItxiaMember
import cn.itxia.api.model.OAuth
import cn.itxia.api.model.repository.OAuthRepository
import cn.itxia.api.response.Response
import cn.itxia.api.response.ResponseCode
import com.fasterxml.jackson.databind.ObjectMapper
import okhttp3.OkHttpClient
import okhttp3.Request
import org.bson.types.ObjectId
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

@Service
class OAuthService {

    @Autowired
    private lateinit var oAuthRepository: OAuthRepository

    @Autowired
    private lateinit var authenticationService: AuthenticationService

    private val client = OkHttpClient()

    /**
     * 通过QQ OAuth登录.
     * */
    fun qqOAuthLogin(accessToken: String, httpServletRequest: HttpServletRequest, httpServletResponse: HttpServletResponse): Response {
        val openID = getOpenID(accessToken)
        if (openID != null) {
            val oauth = oAuthRepository.findByQqOpenID(openID)
            if (oauth != null) {
                val member = oauth.member
                authenticationService.login(member, httpServletRequest, httpServletResponse)
                return ResponseCode.QQ_OAUTH_LOGIN_SUCCESSFUL.withoutPayload()
            }
        }
        return ResponseCode.NO_OAUTH_ID_FOUND.withPayload("请先绑定后再通过QQ登录")
    }

    /**
     * 绑定QQ OAuth.
     * */
    fun bindQQOAuth(accessToken: String, itxiaMember: ItxiaMember): Response {
        val openID = getOpenID(accessToken)
                ?: return ResponseCode.UNKNOWN_ERROR.withPayload("无法获取OpenID")

        //为了防止同一个人多次绑定，先把原来的删了
        oAuthRepository.deleteAllByMember(itxiaMember)

        val oauth = OAuth(
                _id = ObjectId.get().toHexString(), member = itxiaMember, qqOpenID = openID
        )
        oAuthRepository.save(oauth)
        return ResponseCode.QQ_OAUTH_BIND_SUCCESSFUL.withoutPayload()
    }

    fun checkIfBoundQQOAuth(itxiaMember: ItxiaMember): Boolean {
        return oAuthRepository.findByMember(itxiaMember) != null
    }

    /**
     * 获取QQ OpenID.
     * */
    private fun getOpenID(accessToken: String): String? {
        val url = "https://graph.qq.com/oauth2.0/me?access_token=${accessToken}&fmt=json"
        val request = Request.Builder()
                .url(url)
                .get()
                .build()
        client.newCall(request).execute().use { response ->
            if (!response.isSuccessful || response.body == null) {
                return null
            }
            val body = response.body!!.string()
            val result = ObjectMapper().readValue(body, qqOAuthResponse::class.java)
            return result.openid
        }
    }


    /**
     * 这里没法用data class.
     * 也不能少字段，否则mapper会报UnrecognizedPropertyException.
     * */
    private class qqOAuthResponse() {
        val client_id: String? = null
        val openid: String? = null
        val error: String? = null
        val error_description: String? = null
    }

}
