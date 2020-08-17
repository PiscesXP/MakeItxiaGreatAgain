package cn.itxia.api.service

import cn.itxia.api.enum.OrderActionEnum
import cn.itxia.api.model.ItxiaMember
import cn.itxia.api.model.Order
import cn.itxia.api.model.Reply
import com.aliyuncs.DefaultAcsClient
import com.aliyuncs.dm.model.v20151123.SingleSendMailRequest
import com.aliyuncs.exceptions.ClientException
import com.aliyuncs.profile.DefaultProfile
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service

@Service
class EmailService {

    @Value("\${aliyun.email.access-key-id}")
    private lateinit var accessKeyId: String;

    @Value("\${aliyun.email.access-key-secret}")
    private lateinit var accessKeySecret: String;

    @Value("\${aliyun.email.region}")
    private lateinit var region: String;

    private fun sendEmail(address: String, title: String, content: String, isHtmlContent: Boolean = false) {
        val profile = DefaultProfile.getProfile(region, accessKeyId, accessKeySecret)
        val client = DefaultAcsClient(profile)
        val request = SingleSendMailRequest()

        request.apply {
            accountName = "nju@itxia.cn"
            addressType = 1
            replyToAddress = true
            subject = "NJU IT侠 - $title"
            sysRegionId = region

            toAddress = address

            if (isHtmlContent) {
                htmlBody = content
            } else {
                textBody = content
            }
        }
        try {
            val response = client.getAcsResponse(request)
            println("Sent email to ${address}")
        } catch (e: ClientException) {
            println(e.errMsg)
        }
    }

    fun noticeCustomNewReply(address: String, order: Order, reply: Reply, itxiaMember: ItxiaMember) {
        sendEmail(
                address = address,
                title = "新回复消息",
                content = """
                    ${order.name}同学:
                        你好，你的预约单有新的回复:
                        ${itxiaMember.realName}: ${reply.content.replace("\n", " ")}
                        
                        请及时到预约系统查看。
                        请勿回复此邮件。
                    NJU IT侠
                """.trimIndent().replace("\t", "  ")
        )
    }

    fun validateMemberEmail() {

    }

    /**
     * 发送邮件提醒预约单状态变更.
     * 目前只在接单时发提醒.
     *
     * */
    fun noticeOrderStatusChange(order: Order, action: OrderActionEnum, handler: ItxiaMember?) {
        if (!order.acceptEmailNotification) {
            return
        }
        val targetAddress = order.email ?: return

        when (action) {
            OrderActionEnum.ACCEPT -> {
                sendEmail(
                        address = targetAddress,
                        title = "正在处理你的预约单",
                        content = """
                            同学你好!
                            
                            IT侠正在处理你的预约单.
                        """.trimIndent()
                )
            }
        }
    }

}
