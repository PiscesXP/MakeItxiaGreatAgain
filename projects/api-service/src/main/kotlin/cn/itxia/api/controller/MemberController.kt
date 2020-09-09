package cn.itxia.api.controller

import cn.itxia.api.annotation.CurrentItxiaMember
import cn.itxia.api.annotation.RequireItxiaMember
import cn.itxia.api.dto.MemberProfileModifyDto
import cn.itxia.api.dto.MemberRoleChangeDto
import cn.itxia.api.dto.PasswordModifyDto
import cn.itxia.api.enum.MemberRoleEnum
import cn.itxia.api.model.ItxiaMember
import cn.itxia.api.response.Response
import cn.itxia.api.response.ResponseCode
import cn.itxia.api.service.MemberService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.mongodb.core.MongoTemplate
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*

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
            @RequestBody @Validated passwordModifyDto: PasswordModifyDto,
            @CurrentItxiaMember itxiaMember: ItxiaMember): Response {
        return if (memberService.passwordModify(passwordModifyDto, itxiaMember)) {
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
            @CurrentItxiaMember itxiaMember: ItxiaMember): Response {
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
    fun changeMemberRole(@PathVariable memberID: String,
                         @RequestBody dto: MemberRoleChangeDto,
                         @CurrentItxiaMember itxiaMember: ItxiaMember): Response {
        if (memberService.changeMemberRole(memberID, dto, itxiaMember)) {
            return ResponseCode.SUCCESS.withoutPayload()
        }
        return ResponseCode.UNKNOWN_ERROR.withPayload("请检查成员ID或权限.")
    }
}
