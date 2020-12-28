package cn.itxia.api.controller

import cn.itxia.api.annotation.CurrentItxiaMember
import cn.itxia.api.annotation.RequireItxiaMember
import cn.itxia.api.dto.*
import cn.itxia.api.enum.MemberRoleEnum
import cn.itxia.api.model.ItxiaMember
import cn.itxia.api.response.Response
import cn.itxia.api.response.ResponseCode
import cn.itxia.api.service.MemberService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*
import javax.servlet.http.HttpServletRequest

@RestController
class MemberController {

    @Autowired
    private lateinit var memberService: MemberService

    /**
     * 修改密码.
     * */
    @PutMapping("/member/me/password")
    @RequireItxiaMember
    fun modifyPassword(
        @RequestBody @Validated dto: PasswordModifyDto,
        @CurrentItxiaMember requester: ItxiaMember,
        request: HttpServletRequest
    ): Response {
        if (dto.password != dto.confirmPassword) {
            return ResponseCode.INVALID_PARAM.withPayload("两次输入的密码不一致.")
        }
        return if (memberService.passwordModify(dto, requester, request)) {
            ResponseCode.SUCCESS.withPayload("密码修改成功.")
        } else {
            ResponseCode.UNKNOWN_ERROR.withPayload("修改失败.")
        }
    }

    /**
     * 修改个人信息.
     * */
    @PutMapping("/member/me/profile")
    @RequireItxiaMember
    fun modifyProfile(
        @RequestBody @Validated memberProfileModifyDto: MemberProfileModifyDto,
        @CurrentItxiaMember itxiaMember: ItxiaMember
    ): Response {
        memberService.modifyProfile(memberProfileModifyDto, itxiaMember)
        return ResponseCode.SUCCESS.withoutPayload()
    }

    @GetMapping("/member/all")
    @RequireItxiaMember(MemberRoleEnum.ADMIN)
    fun getAllMemberInfo(): Response {
        return ResponseCode.SUCCESS.withPayload(memberService.getAllMemberInfo())
    }

    @PutMapping("/member/{memberID}/role")
    @RequireItxiaMember(MemberRoleEnum.ADMIN)
    fun changeMemberRole(
        @PathVariable memberID: String,
        @RequestBody dto: MemberRoleChangeDto,
        @CurrentItxiaMember itxiaMember: ItxiaMember
    ): Response {
        if (memberService.changeMemberRole(memberID, dto, itxiaMember)) {
            return ResponseCode.SUCCESS.withoutPayload()
        }
        return ResponseCode.UNKNOWN_ERROR.withPayload("请检查成员ID或权限.")
    }

    @PutMapping("/member/{memberID}/disabled")
    @RequireItxiaMember(MemberRoleEnum.ADMIN)
    fun changeMemberDisabledStatus(
        @PathVariable memberID: String,
        @RequestBody dto: MemberDisabledStatusChangeDto,
        @CurrentItxiaMember itxiaMember: ItxiaMember
    ): Response {
        if (memberService.changeMemberDisabledStatus(memberID, dto, itxiaMember)) {
            return ResponseCode.SUCCESS.withoutPayload()
        }
        return ResponseCode.UNKNOWN_ERROR.withPayload("请检查成员ID或权限.")
    }

    /**
     * 直接重置密码.
     * 返回随机生成的密码.
     * */
    @PostMapping("/member/{memberID}/password")
    @RequireItxiaMember(MemberRoleEnum.ADMIN)
    fun resetMemberPassword(
        @PathVariable memberID: String,
        @CurrentItxiaMember requester: ItxiaMember
    ): Response {
        return memberService.resetMemberPassword(memberID, requester)
    }

    /**
     * 通过生成邀请码，邀请新成员加入.
     * */
    @PostMapping("/member/recruit")
    @RequireItxiaMember(MemberRoleEnum.ADMIN)
    fun recruitNewMemberByRedeemCode(@CurrentItxiaMember requester: ItxiaMember): Response {
        return ResponseCode.SUCCESS.withPayload(memberService.recruitNewMemberByRedeemCode(requester))
    }

    /**
     * 获取所有邀请码.
     * */
    @GetMapping("/member/recruit")
    @RequireItxiaMember(MemberRoleEnum.ADMIN)
    fun getMyRedeemCode(@CurrentItxiaMember requester: ItxiaMember): Response {
        return ResponseCode.SUCCESS.withPayload(memberService.getMyRedeemCode(requester))
    }

    @DeleteMapping("/member/recruit/{redeemCodeID}")
    @RequireItxiaMember(MemberRoleEnum.ADMIN)
    fun deleteRedeemCode(@PathVariable redeemCodeID: String): Response {
        memberService.deleteRedeemCode(redeemCodeID)
        return ResponseCode.SUCCESS.withoutPayload()
    }

    /**
     * 验证邀请码是否有效.
     * */
    @PostMapping("/member/recruit/validate")
    fun validateRecruitRedeemCode(@RequestBody redeemCodeValue: String): Response {
        return if (memberService.validateRecruitRedeemCode(redeemCodeValue)) {
            ResponseCode.SUCCESS.withoutPayload()
        } else {
            ResponseCode.INVALID_REDEEM_CODE.withoutPayload()
        }
    }

    /**
     * 检查登录ID是否已经使用.
     * */
    @PostMapping("/member/id/check")
    fun checkIfLoginNameAlreadyExisted(@RequestBody loginName: String): Response {
        return if (memberService.checkIfLoginNameAlreadyExisted(loginName)) {
            ResponseCode.LOGIN_NAME_ALREADY_EXISTED.withoutPayload()
        } else {
            ResponseCode.SUCCESS.withoutPayload()
        }
    }

    /**
     * 通过邀请码，注册新成员.
     * */
    @PostMapping("/member/recruit/register")
    fun registerNewMemberByRedeemCode(@RequestBody memberRecruitDto: MemberRecruitDto): Response {
        return memberService.registerNewMemberByRedeemCode(memberRecruitDto)
    }

}
