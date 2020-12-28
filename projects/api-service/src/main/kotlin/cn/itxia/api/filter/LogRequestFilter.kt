package cn.itxia.api.filter

import cn.itxia.api.service.RequestLogService
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.core.annotation.Order
import org.springframework.stereotype.Component
import javax.servlet.Filter
import javax.servlet.FilterChain
import javax.servlet.ServletRequest
import javax.servlet.ServletResponse

@Component
@Order(2)
class LogRequestFilter : Filter {

    @Autowired
    private lateinit var requestLogService: RequestLogService

    override fun doFilter(servletRequest: ServletRequest, servletResponse: ServletResponse, chain: FilterChain) {
        GlobalScope.launch {
            requestLogService.logMemberActivity(servletRequest, servletResponse)
        }
        chain.doFilter(servletRequest, servletResponse)
    }

}
