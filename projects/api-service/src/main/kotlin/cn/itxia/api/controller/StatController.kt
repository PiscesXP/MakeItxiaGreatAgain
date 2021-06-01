package cn.itxia.api.controller

import cn.itxia.api.annotation.CurrentItxiaMember
import cn.itxia.api.annotation.RequireItxiaMember
import cn.itxia.api.model.ItxiaMember
import cn.itxia.api.response.Response
import cn.itxia.api.response.ResponseCode
import cn.itxia.api.service.StatService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class StatController {

    @Autowired
    private lateinit var statService: StatService

    @GetMapping("/itxiaStat/all")
    @RequireItxiaMember
    fun getStatData(): Response {
        return ResponseCode.SUCCESS.withPayload(statService.getAllStat())
    }

    @GetMapping("/itxiaStat/me")
    @RequireItxiaMember
    fun getMyStatData(@CurrentItxiaMember itxiaMember: ItxiaMember): Response {
        return ResponseCode.SUCCESS.withPayload(statService.getStatByMember(itxiaMember))
    }

    @GetMapping("/itxiaStat/charts")
    @RequireItxiaMember
    fun getOrderCountsByDay(): Response {
        return ResponseCode.SUCCESS.withPayload(
            statService.getChartsStat()
        )
    }

}
