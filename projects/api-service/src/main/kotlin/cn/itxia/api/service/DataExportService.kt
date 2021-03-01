package cn.itxia.api.service

import cn.itxia.api.model.repository.OrderRepository
import cn.itxia.api.util.getLogger
import com.alibaba.excel.EasyExcel
import com.alibaba.excel.annotation.ExcelProperty
import com.alibaba.excel.write.style.column.LongestMatchColumnWidthStyleStrategy
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.io.File
import java.text.SimpleDateFormat

@Service
class DataExportService {

    @Autowired
    private lateinit var orderRepository: OrderRepository

    private val path = "order data.xlsx"

    private val logger = getLogger()

    fun exportOrderData() {
        logger.info("收集数据中...")
        val data = gatherData()

        logger.info("导出数据到文件:$path.")
        EasyExcel.write(File(path), ExportOrder::class.java)
            .sheet("预约单统计")
            .registerWriteHandler(LongestMatchColumnWidthStyleStrategy())
            .doWrite(data)

        logger.info("数据已导出.")
    }

    private fun gatherData(): List<ExportOrder> {

        val simpleDateFormat = SimpleDateFormat("yyyy/MM/dd")

        return orderRepository.findAllByDeletedFalse().map {
            it.run {
                ExportOrder(
                    _id = _id,
                    campus = campus.campusName,
                    status = status.statusName,
                    handlerName = handler?.realName ?: "",
                    createTime = simpleDateFormat.format(createTime),
                    name = name,
                    os = os,
                    brandModel = brandModel,
                    warranty = warranty ?: "",
                    description = description,
                )
            }
        }
    }


}

private data class ExportOrder(

    @ExcelProperty("ID")
    val _id: String,

    @ExcelProperty("校区")
    val campus: String,

    @ExcelProperty("预约单状态")
    var status: String,

    @ExcelProperty("IT侠姓名")
    var handlerName: String,

    @ExcelProperty("预约时间")
    val createTime: String,

    @ExcelProperty("预约人")
    val name: String,

    @ExcelProperty("操作系统")
    val os: String,

    @ExcelProperty("电脑型号")
    val brandModel: String,

    @ExcelProperty("保修情况")
    val warranty: String,

    @ExcelProperty("问题描述")
    val description: String,
/*
    @ExcelProperty("手机号")
    val phone: String,

    @ExcelProperty("QQ")
    val qq: String,

    @ExcelProperty("Email")
    val email: String,
*/
)
