package cn.itxia.api.service

import cn.itxia.api.dto.MemberProfileModifyDto
import cn.itxia.api.dto.PasswordModifyDto
import cn.itxia.api.enum.CampusEnum
import cn.itxia.api.model.ItxiaMember
import cn.itxia.api.model.repository.ItxiaMemberRepository
import cn.itxia.api.util.PasswordUtil
import org.springframework.beans.factory.annotation.Autowired
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
            member.email = dto.email
            if (!dto.email.isNullOrEmpty()) {
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

}
