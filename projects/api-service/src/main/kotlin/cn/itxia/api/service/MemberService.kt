package cn.itxia.api.service

import cn.itxia.api.dto.*
import cn.itxia.api.enum.CampusEnum
import cn.itxia.api.enum.MemberGroupEnum
import cn.itxia.api.enum.MemberRoleEnum
import cn.itxia.api.enum.RedeemCodeTypeEnum
import cn.itxia.api.model.ItxiaMember
import cn.itxia.api.model.RedeemCode
import cn.itxia.api.model.repository.ItxiaMemberRepository
import cn.itxia.api.response.Response
import cn.itxia.api.response.ResponseCode
import cn.itxia.api.util.PasswordUtil
import com.mongodb.client.result.UpdateResult
import org.apache.commons.lang3.RandomStringUtils
import org.bson.types.ObjectId
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.mongodb.core.MongoTemplate
import org.springframework.data.mongodb.core.query.Criteria
import org.springframework.data.mongodb.core.query.Query
import org.springframework.data.mongodb.core.query.Update
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import java.util.*
import javax.servlet.http.HttpServletRequest

@Service
class MemberService {

    @Autowired
    private lateinit var memberRepository: ItxiaMemberRepository

    @Autowired
    private lateinit var mongoTemplate: MongoTemplate

    @Autowired
    private lateinit var authenticationService: AuthenticationService

    /**
     * 修改密码.
     * @return 修改是否成功.
     * */
    fun passwordModify(dto: PasswordModifyDto,
                       requester: ItxiaMember,
                       request: HttpServletRequest
    ): Boolean {
        //好像不用再查一次，但又感觉有点不对劲
        val member = memberRepository.findByIdOrNull(requester._id) ?: return false
        member.apply {
            password = PasswordUtil.encrypt(dto.password)
            requirePasswordReset = false
        }
        memberRepository.save(member)

        //注销其它登录状态
        if (dto.logoutOnOtherDevices) {
            authenticationService.logoutOnOtherDevices(requester, request)
        }

        return true
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
            member.group = dto.group.let { MemberGroupEnum.parse(it) } ?: member.group
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
        return mongoTemplate.query(ItxiaMember::class.java).matching(
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

    /**
     * 更改指定成员的权限.
     * */
    fun changeMemberRole(memberID: String,
                         dto: MemberRoleChangeDto,
                         requester: ItxiaMember): Boolean {
        val criteria = Criteria()
        if (requester.role == MemberRoleEnum.ADMIN) {
            if (dto.role == MemberRoleEnum.SUPER_ADMIN) {
                return false
            }
            criteria.and("role").ne(MemberRoleEnum.SUPER_ADMIN)
        }
        return modifyOneMember(
                memberID = memberID,
                criteria = criteria,
                update = Update.update("role", dto.role)
        )
                .modifiedCount == 1L
    }

    /**
     * 更改指定成员的禁用状态.
     * */
    fun changeMemberDisabledStatus(memberID: String,
                                   dto: MemberDisabledStatusChangeDto,
                                   requester: ItxiaMember): Boolean {
        val criteria = Criteria()
        if (requester.role == MemberRoleEnum.ADMIN) {
            criteria.and("role").ne(MemberRoleEnum.SUPER_ADMIN)
        }

        //清空该成员对应的session
        val memberToChange = this.getMemberByID(memberID) ?: return false
        authenticationService.removeAllSessionOfMember(memberToChange.toBaseInfoOnly())

        return modifyOneMember(
                memberID = memberID,
                criteria = criteria,
                update = Update.update("disabled", dto.disabled)
        )
                .modifiedCount == 1L
    }

    /**
     * 重置成员的密码.
     * */
    fun resetMemberPassword(memberID: String, requester: ItxiaMember): Response {
        val member = getMemberByID(memberID) ?: return ResponseCode.NO_SUCH_MEMBER.withoutPayload()
        if (!requester.role.isEnoughFor(member.role)) {
            //权限不够
            return ResponseCode.UNAUTHORIZED.withoutPayload()
        }
        val newPassword = RandomStringUtils.randomAlphanumeric(16)
        val result = mongoTemplate.updateFirst(
                Query.query(Criteria.where("_id").`is`(memberID)),
                Update.update("password", PasswordUtil.encrypt(newPassword)).set("requirePasswordReset", true),
                ItxiaMember::class.java
        )
        return if (result.modifiedCount == 1L) {
            ResponseCode.SUCCESS.withPayload(newPassword)
        } else {
            ResponseCode.UNKNOWN_ERROR.withPayload("密码未重置")
        }
    }

    /**
     * 更新一个成员的数据.
     * */
    fun modifyOneMember(memberID: String,
                        criteria: Criteria = Criteria(),
                        update: Update = Update()
    ): UpdateResult {
        criteria.and("_id").`is`(memberID)
        return mongoTemplate.updateFirst(
                Query.query(criteria),
                update,
                ItxiaMember::class.java
        )
    }

    /**
     * 通过生成邀请码，邀请新成员加入.
     * */
    fun recruitNewMemberByRedeemCode(requester: ItxiaMember): String {
        val redeemCodeValue = RandomStringUtils.randomAlphanumeric(16)
        val redeemCode = RedeemCode(
                _id = ObjectId.get().toHexString(),
                provider = requester,
                hasRedeemed = false,
                type = RedeemCodeTypeEnum.RECRUIT,
                redeemCode = redeemCodeValue
        )
        mongoTemplate.save(redeemCode)
        return redeemCodeValue
    }

    /**
     * 获取所有邀请码.
     * */
    fun getMyRedeemCode(requester: ItxiaMember): List<RedeemCode> {
        return mongoTemplate.find(
                Query.query(Criteria.where("provider").`is`(requester)),
                RedeemCode::class.java
        )
    }

    /**
     * 验证邀请码是否有效.
     * */
    fun validateRecruitRedeemCode(codeValue: String): Boolean {
        return mongoTemplate.exists(
                Query.query(Criteria.where("redeemCode").`is`(codeValue)
                        .and("hasRedeemed").`is`(false)
                        .and("type").`is`(RedeemCodeTypeEnum.RECRUIT)
                ),
                RedeemCode::class.java
        )
    }

    fun checkIfLoginNameAlreadyExisted(loginName: String): Boolean {
        return mongoTemplate.exists(
                Query.query(Criteria.where("loginName").`is`(loginName)),
                ItxiaMember::class.java
        )
    }

    /**
     * 通过邀请码，注册新成员.
     * */
    fun registerNewMemberByRedeemCode(dto: MemberRecruitDto): Response {

        if (mongoTemplate.exists(
                        Query.query(Criteria.where("loginName").`is`(dto.loginName)),
                        ItxiaMember::class.java
                )) {
            return ResponseCode.LOGIN_NAME_ALREADY_EXISTED.withoutPayload()
        }

        //验证邀请码，并使用该邀请码
        val update = mongoTemplate.updateFirst(
                Query.query(
                        Criteria.where("redeemCode").`is`(dto.redeemCode)
                                .and("hasRedeemed").ne(true)
                ),
                Update.update("hasRedeemed", true),
                RedeemCode::class.java
        )
        if (update.modifiedCount != 1L) {
            return ResponseCode.INVALID_REDEEM_CODE.withoutPayload()
        }

        val redeemCode = mongoTemplate.findOne(
                Query.query(Criteria.where("redeemCode").`is`(dto.redeemCode)),
                RedeemCode::class.java
        )
                ?: return ResponseCode.UNKNOWN_ERROR.withoutPayload()

        //创建新成员
        val newMember = ItxiaMember(
                _id = ObjectId.get().toHexString(),
                loginName = dto.loginName,
                realName = dto.realName,
                password = PasswordUtil.encrypt(dto.password),
                campus = dto.campus,
                group = dto.group,
                role = MemberRoleEnum.MEMBER,
                disabled = true,        //需要管理员手动启用，相当于审核
                joinDate = Date(),
                requirePasswordReset = false,
                inviteBy = redeemCode.provider.toBaseInfoOnly()
        )
        mongoTemplate.save(newMember)

        redeemCode.receiver = newMember
        mongoTemplate.save(redeemCode)

        return ResponseCode.SUCCESS.withoutPayload()
    }

    fun deleteRedeemCode(redeemCodeID: String): Boolean {
        return mongoTemplate.remove(
                Query.query(
                        Criteria.where("_id").`is`(redeemCodeID)
                                .and("hasRedeemed").ne(true)
                ),
                RedeemCode::class.java
        ).deletedCount == 1L
    }
}
