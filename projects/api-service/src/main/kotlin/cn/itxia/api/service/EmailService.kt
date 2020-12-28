package cn.itxia.api.service

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
    private lateinit var accessKeyId: String

    @Value("\${aliyun.email.access-key-secret}")
    private lateinit var accessKeySecret: String

    @Value("\${aliyun.email.region}")
    private lateinit var region: String

    private fun sendEmail(address: String, title: String, content: String, isHtmlContent: Boolean = false) {
        val profile = DefaultProfile.getProfile(region, accessKeyId, accessKeySecret)
        val client = DefaultAcsClient(profile)
        val request = SingleSendMailRequest()

        request.apply {
            accountName = "nju@itxia.cn"
            fromAlias = "南京大学IT侠"
            addressType = 1
            replyToAddress = true
            subject = title
            sysRegionId = region

            toAddress = address

            if (isHtmlContent) {
                htmlBody = content
            } else {
                textBody = content
            }
        }
        try {
            client.getAcsResponse(request)
            println("Sent email to ${address}")
        } catch (e: ClientException) {
            println(e.errMsg)
        }
    }

    /**
     * 提醒预约者，有新的回复.
     * */
    fun noticeCustomNewReply(address: String, order: Order, reply: Reply, handler: ItxiaMember) {
        sendEmail(
            address = address,
            title = "你的预约单有新回复",
            content = """
${order.name}同学:
你好，${handler.realName} 在你的预约单回复了消息:
-------------------------------
${reply.content}
-------------------------------
请及时到预约系统查看。
请勿回复此邮件。

NJU IT侠
                """.trimIndent().replace("\t", "  ")
        )
    }

    /**
     * 提醒成员，本校区有新单子.
     * 不做是否本校区的判断.
     * */
    fun noticeItxiaMemberThatCampusHasNewOrder(address: String, order: Order, itxiaMember: ItxiaMember) {
        sendEmail(
            address = address,
            title = "新预约单提醒",
            content = """
${itxiaMember.realName}同学:

${order.campus.campusName}校区的 ${order.name} 发起了预约，问题描述如下:
(请勿相信其中的链接)
-------------------------------
${order.description}
-------------------------------
请及时到预约系统查看。
请勿回复此邮件。

NJU IT侠
                """.trimIndent()
        )
    }


    /**
     * 提醒接单的it侠，预约单有新的回复.
     * */
    fun noticeItxiaMemberThatOrderHasNewReply(address: String, order: Order, reply: Reply, itxiaMember: ItxiaMember) {
        sendEmail(
            address = address,
            title = "新回复",
            content = """
${itxiaMember.realName}同学:

你在处理的 ${order.name} 的单子有了新回复，内容如下:
-------------------------------
${reply.content}
-------------------------------
请及时到预约系统查看。
请勿回复此邮件。

NJU IT侠
                """.trimIndent()
        )
    }

}
