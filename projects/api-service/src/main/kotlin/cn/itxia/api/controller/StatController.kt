package cn.itxia.api.controller

import cn.itxia.api.annotation.CurrentItxiaMember
import cn.itxia.api.annotation.RequireItxiaMember
import cn.itxia.api.model.ItxiaMember
import cn.itxia.api.response.Response
import cn.itxia.api.response.ResponseCode
import cn.itxia.api.service.StatService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
class StatController {

    @Autowired
    private lateinit var statService: StatService

    @GetMapping("/stat")
    @RequireItxiaMember
    fun getStatData(@RequestParam(required = false) mine: String?,
                    @CurrentItxiaMember itxiaMember: ItxiaMember): Response {
        return if (mine != null) {
            ResponseCode.SUCCESS.withPayload(statService.getStatByMember(itxiaMember))
        } else {
            ResponseCode.SUCCESS.withPayload(statService.getAllStat())
        }
    }

}
