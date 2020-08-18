package cn.itxia.api.controller

import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping

@Controller
class SpaRedirectController {

    @GetMapping(value = ["/wcms/**", "/custom/**"])
    fun redirectSpaRouter(): String {
        return "forward:/index.html"
    }

}
