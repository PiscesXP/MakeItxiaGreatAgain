package cn.itxia.api.controller

import cn.itxia.api.annotation.CurrentItxiaMember
import cn.itxia.api.model.ItxiaMember
import cn.itxia.api.response.Response
import cn.itxia.api.service.AttachmentService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile
import javax.servlet.http.HttpServletResponse

/**
 * 附件上传/下载.
 * */
//TODO 支持缩略图.
@RestController
class AttachmentController {

    @Autowired
    private lateinit var attachmentService: AttachmentService

    @PostMapping("/upload")
    fun upload(@RequestParam("file") file: MultipartFile,
               @CurrentItxiaMember itxiaMember: ItxiaMember?): Response {
        return attachmentService.handleUpload(file, itxiaMember)
    }

    @GetMapping("/upload/{_id}")
    fun getFile(@PathVariable _id: String,
                @RequestParam(required = false) download: String?,
                response: HttpServletResponse): Response {
        val isDownload = download != null
        return attachmentService.getFile(_id, isDownload, response)
    }
}

