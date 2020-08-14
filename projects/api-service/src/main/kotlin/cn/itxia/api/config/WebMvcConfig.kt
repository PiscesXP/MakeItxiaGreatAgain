package cn.itxia.api.config

import cn.itxia.api.annotation.CurrentItxiaMemberArgumentResolver
import cn.itxia.api.annotation.RequireItxiaMemberInterceptor
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.annotation.Configuration
import org.springframework.web.method.support.HandlerMethodArgumentResolver
import org.springframework.web.servlet.config.annotation.InterceptorRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer

@Configuration
class WebMvcConfig : WebMvcConfigurer {

    @Autowired
    lateinit var currentItxiaMemberArgumentResolver: CurrentItxiaMemberArgumentResolver

    @Autowired
    lateinit var requireItxiaMemberInterceptor: RequireItxiaMemberInterceptor

    override fun addArgumentResolvers(resolvers: MutableList<HandlerMethodArgumentResolver>) {
        resolvers.add(currentItxiaMemberArgumentResolver)
        super.addArgumentResolvers(resolvers)
    }

    override fun addInterceptors(registry: InterceptorRegistry) {
        registry.addInterceptor(requireItxiaMemberInterceptor)
        super.addInterceptors(registry)
    }
}
