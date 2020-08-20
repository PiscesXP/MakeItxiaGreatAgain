package cn.itxia.api.service

import cn.itxia.api.dto.MemberProfileModifyDto
import cn.itxia.api.dto.PasswordModifyDto
import cn.itxia.api.enum.CampusEnum
import cn.itxia.api.model.ItxiaMember
import cn.itxia.api.model.repository.ItxiaMemberRepository
import cn.itxia.api.util.PasswordUtil
import com.mongodb.client.MongoClients
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.mongodb.core.MongoTemplate
import org.springframework.data.mongodb.core.query.Criteria
import org.springframework.data.mongodb.core.query.Query
import org.springframework.stereotype.Service
import java.util.*

@Service
class MemberService {

    @Autowired
    private lateinit var memberRepository: ItxiaMemberRepository

    /**
     * 修改密码.
     * @return 修改是否成功.
     * */
    fun passwordModify(passwordModifyDto: PasswordModifyDto,
                       itxiaMember: ItxiaMember): Boolean {
        //好像不用再查一次，但又感觉有点不对劲
        val optional = memberRepository.findById(itxiaMember._id)
        if (optional.isPresent) {
            val member = optional.get()
            member.password = PasswordUtil.encrypt(passwordModifyDto.newPassword)
            member.requirePasswordReset = false
            memberRepository.save(member)
            return true
        }
        return false
    }

    /**
     * 修改个人信息.
     * */
    fun modifyProfile(dto: MemberProfileModifyDto,
                      itxiaMember: ItxiaMember) {
        val optional = memberRepository.findById(itxiaMember._id)
        if (optional.isPresent) {
            val member = optional.get()
            member.campus = dto.campus.let { CampusEnum.parse(it) } ?: member.campus
            if (dto.email.isNullOrEmpty()) {
                member.email = null
                member.emailNotification.apply {
                    onMyCampusHasNewOrder = false
                    onMyOrderHasNewReply = false
                }
            } else {
                member.email = dto.email
                member.emailNotification.onMyCampusHasNewOrder = dto.emailNotification?.contains("onMyCampusHasNewOrder")
                        ?: false
                member.emailNotification.onMyOrderHasNewReply = dto.emailNotification?.contains("onMyOrderHasNewReply")
                        ?: false
            }
            memberRepository.save(member)
        }
    }

    /**
     * 记录最后登录时间.
     * */
    fun recordLastLogin(itxiaMember: ItxiaMember) {
        val optional = memberRepository.findById(itxiaMember._id)
        if (optional.isPresent) {
            val member = optional.get()
            member.lastLogin = Date()
            memberRepository.save(member)
        }
    }

    /**
     * 获取所有成员信息.
     * */
    fun getAllMemberInfo(): List<ItxiaMember> {
        return memberRepository.findAll().map { it.also { it.password = "" } }
    }


    fun getAllMemberThatReceiveEmailNotification(notificationName: String, campus: CampusEnum): List<ItxiaMember> {
        //TODO 将MongoTemplate移动到helper类中
        val op = MongoTemplate(MongoClients.create(), "itxia")
        return op.query(ItxiaMember::class.java).matching(
                Query.query(
                        Criteria.where("emailNotification.${notificationName}").`is`(true)
                                .and("campus").`is`(campus)
                )
        ).all()
    }

    fun getMemberByID(id: String?): ItxiaMember? {
        if (id == null) {
            return null
        }
        val optional = memberRepository.findById(id)
        if (optional.isPresent) {
            return optional.get()
        }
        return null
    }
}
