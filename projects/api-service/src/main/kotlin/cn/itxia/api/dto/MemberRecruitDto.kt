package cn.itxia.api.dto

import cn.itxia.api.enum.CampusEnum
import cn.itxia.api.enum.MemberGroupEnum

data class MemberRecruitDto(

        val redeemCode: String,

        val loginName: String,

        val realName: String,

        var password: String,

        var campus: CampusEnum,

        val group: MemberGroupEnum

)
