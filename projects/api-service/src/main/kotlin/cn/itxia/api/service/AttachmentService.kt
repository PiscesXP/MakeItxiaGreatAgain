package cn.itxia.api.service

import cn.itxia.api.model.Attachment
import cn.itxia.api.model.ItxiaMember
import cn.itxia.api.model.repository.AttachmentRepository
import cn.itxia.api.response.Response
import cn.itxia.api.response.ResponseCode
import net.coobird.thumbnailator.Thumbnails
import org.bson.types.ObjectId
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import org.springframework.util.DigestUtils
import org.springframework.web.multipart.MultipartFile
import java.io.File
import java.io.FileNotFoundException
import java.io.IOException
import java.net.URLEncoder
import java.util.*
import javax.servlet.http.HttpServletResponse

/**
 * 附件上传相关.
 * */
@Service
class AttachmentService {

    /**
     * 附件文件放置的根目录.
     * */
    @Value("\${itxia.attachment.dir}")
    private lateinit var rootDir: String

    @Autowired
    private lateinit var attachmentRepository: AttachmentRepository

    private val maxThumbnailSize = 50.0

    /**
     * 处理上传文件.
     * */
    fun handleUpload(file: MultipartFile, itxiaMember: ItxiaMember?): Response {
        if (file.isEmpty || file.originalFilename == null) {
            return ResponseCode.FILE_UPLOAD_FAIL.withPayload("附件不能为空.")
        }

        val md5 = DigestUtils.md5DigestAsHex(file.bytes)

        val attachment = Attachment(
                _id = ObjectId.get().toHexString(),
                fileName = file.originalFilename!!,
                size = file.size,
                mimeType = file.contentType,
                md5 = md5,
                uploadBy = itxiaMember?.toBaseInfoOnly(),
                uploadTime = Date(),
                deleted = false
        )
        val savedResult = attachmentRepository.save(attachment)
        //save to file system
        val path = "${rootDir}${md5}"
        val diskFile = File(path)
        if (!diskFile.exists()) {
            file.transferTo(diskFile)
        }

        return ResponseCode.SUCCESS.withPayload(savedResult)
    }

    /**
     * 获取文件.
     * */
    fun getFile(_id: String, isDownload: Boolean, isThumbnail: Boolean, response: HttpServletResponse) {
        val attachment = attachmentRepository.findBy_idAndDeletedFalse(_id)
                ?: return
        val isImage = attachment.mimeType?.contains("image") ?: false

        if (isThumbnail && !isImage) {
            //非图片不生成缩略图
            return
        }

        if (isDownload) {
            //加入下载header.
            val encodedFileName = URLEncoder.encode(attachment.fileName, "UTF-8")
            val value = "attachment; filename*=UTF-8''${encodedFileName}"
            response.setHeader("Content-Disposition", value)
        }

        val file = File("${rootDir}${attachment.md5}")
        try {
            if (isImage && isThumbnail) {
                if (attachment.size > 100 * 1024) {
                    //只为100KB以上的图片生成缩略图
                    Thumbnails.of(file)
                            .size(200, 200)
                            .outputQuality(0.6)
                            .keepAspectRatio(true)
                            .toOutputStream(response.outputStream)
                }
            } else if (isImage && !isDownload && attachment.size > 100 * 1024) {
                //大于100KB的图片，生成等尺寸压缩图(不是缩略图)
                Thumbnails.of(file)
                        .scale(1.0)
                        .outputQuality(0.6)
                        .toOutputStream(response.outputStream)
            } else if (!isImage && !isDownload) {
                //do nothing
            } else {
                //返回原文件
                val fileBytes = file.readBytes()
                response.outputStream.write(fileBytes)
            }
        } catch (fileNotFoundException: FileNotFoundException) {
            //TODO log this
            response.status = 404
            return
        } catch (ioException: IOException) {
            response.status = 500
            return
        }
        return
    }

    /**
     * 由ObjectID获取附件.
     *
     * @param idList ObjectID列表.
     * @return 附件列表.
     * */
    fun getAttachmentListByIDList(idList: List<String>): List<Attachment> {
        return attachmentRepository.findAllBy_idInAndDeletedFalse(idList).toMutableList()
    }
}
