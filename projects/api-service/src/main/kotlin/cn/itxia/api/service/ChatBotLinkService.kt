package cn.itxia.api.service

import cn.itxia.api.dto.ValidateMemberQQDto
import cn.itxia.api.model.Order
import cn.itxia.api.model.repository.ItxiaMemberRepository
import cn.itxia.api.util.getLogger
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.KotlinModule
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import java.io.IOException
import javax.servlet.http.HttpServletRequest

@Service
class ChatBotLinkService {
    @Value("\${itxia.bot.hook.base-uri}")
    private lateinit var baseUri: String

    @Value("\${itxia.bot.hook.token}")
    private lateinit var token: String

    @Autowired
    private lateinit var memberRepository: ItxiaMemberRepository

    private val client = OkHttpClient()

    private val mapper = ObjectMapper().registerModule(KotlinModule())

    private val logger = getLogger()

    /**
     * 提醒bot有新预约单啦~
     * */
    fun notifyNewOrder(order: Order) {
        val url = "http://${baseUri}/hook/newOrder"

        val newOrderNotification = order.run {
            NewOrderNotification(
                name = name,
                campus = campus.campusName,
                description = description
            )
        }

        val request = Request.Builder()
            .url(url)
            .addHeader("bot-token", token)
            .post(
                mapper.writeValueAsString(newOrderNotification)
                    .toRequestBody("application/json; charset=utf-8".toMediaType())
            )
            .build()

        try {
            client.newCall(request).execute().apply {
                if (isSuccessful) {
                    logger.info("已调用bot hook.")
                } else {
                    logger.error("调用bot hook失败.")
                }
            }
        } catch (e: IOException) {
            logger.error("调用bot hook失败:${e.message}")
        }
    }

    fun validateMemberQQID(request: HttpServletRequest, dto: ValidateMemberQQDto): Boolean {
        if (request.getHeader("bot-token") == token) {
            return memberRepository.existsByQqAndDisabledFalse(dto.qq)
        }
        return false
    }

}

private data class NewOrderNotification(
    val name: String,
    val campus: String,
    val description: String,
)
