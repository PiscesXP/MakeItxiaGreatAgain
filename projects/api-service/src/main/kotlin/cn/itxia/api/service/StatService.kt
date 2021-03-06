package cn.itxia.api.service

import cn.itxia.api.enum.CampusEnum
import cn.itxia.api.enum.OrderStatusEnum
import cn.itxia.api.model.ItxiaMember
import cn.itxia.api.model.repository.OrderRecordTagRepository
import cn.itxia.api.model.repository.OrderRepository
import cn.itxia.api.util.getLogger
import cn.itxia.api.vo.ChartsStatVo
import cn.itxia.api.vo.StatOfAllVo
import cn.itxia.api.vo.StatOfMemberVo
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.text.SimpleDateFormat
import java.util.*

@Service
class StatService {

    @Autowired
    private lateinit var orderRepository: OrderRepository

    @Autowired
    private lateinit var orderRecordTagRepository: OrderRecordTagRepository

    private val logger = getLogger()

    private var lastStatTime: Long = 0

    private var lastStatResult: ChartsStatVo? = null

    private val statInterval = 15 * 60 * 1000

    /**
     * 统计全部预约单.
     * 包括:
     * 1. 等待处理、正在处理、已完成的数量.
     * 2. 仙林/鼓楼积压的预约单.(>14天等待处理的)
     * */
    fun getAllStat(): StatOfAllVo {
        //计算14天前的日期.
        val calendar = Calendar.getInstance()
        calendar.time = Date()
        calendar.add(Calendar.DAY_OF_YEAR, -14)
        val twoWeeksAgo = calendar.time

        return StatOfAllVo(
            pendingCount = orderRepository.countByStatusAndDeletedFalse(OrderStatusEnum.PENDING),
            handlingCount = orderRepository.countByStatusAndDeletedFalse(OrderStatusEnum.HANDLING),
            doneCount = orderRepository.countByStatusAndDeletedFalse(OrderStatusEnum.DONE),
            backlogXianlin = orderRepository.countByCampusAndStatusAndCreateTimeBeforeAndDeletedFalse(
                CampusEnum.XIANLIN,
                OrderStatusEnum.PENDING,
                twoWeeksAgo
            ),
            backlogGulou = orderRepository.countByCampusAndStatusAndCreateTimeBeforeAndDeletedFalse(
                CampusEnum.GULOU,
                OrderStatusEnum.PENDING,
                twoWeeksAgo
            )
        )
    }

    /**
     * 统计个人的预约单数量.(正在处理、已完成)
     * */
    fun getStatByMember(itxiaMember: ItxiaMember): StatOfMemberVo {
        val info = itxiaMember.toBaseInfoOnly()
        val handlingCount = orderRepository.countByHandlerAndStatusAndDeletedFalse(info, OrderStatusEnum.HANDLING)
        val doneCount = orderRepository.countByHandlerAndStatusAndDeletedFalse(info, OrderStatusEnum.DONE)
        val totalCount = handlingCount + doneCount
        return StatOfMemberVo(handlingCount, doneCount, totalCount)

    }

    /**
     * 获取图表统计数据.
     * 优先读取缓存内的数据.
     * */
    fun getChartsStat(): ChartsStatVo {
        val currentTime = System.currentTimeMillis()
        if (lastStatResult == null || currentTime - lastStatTime > statInterval) {
            val newStatResult = doChartStat()
            lastStatResult = newStatResult
            lastStatTime = currentTime
            return newStatResult
        }
        return lastStatResult as ChartsStatVo
    }

    private fun doChartStat(): ChartsStatVo {
        val (byDay, byMonth) = getOrderCountsByDates()
        return ChartsStatVo(
            orderCountsByDay = byDay,
            orderCountsByMonth = byMonth,
            expTags = getExpTagsStat()
        )
    }

    /**
     * 按日期(天、月)统计预约量数量.
     * */
    fun getOrderCountsByDates(): Pair<ChartsStatVo.OrderCountsByDate, ChartsStatVo.OrderCountsByDate> {
        val startTime = System.currentTimeMillis()

        val orderList = orderRepository.findAllByDeletedFalseAndStatusIsNot(OrderStatusEnum.CANCELED)
            .sortedBy { it.createTime.time }
        val startDate = orderList[0].createTime

        val currentDay = Calendar.getInstance()
        currentDay.time = startDate
        currentDay.set(Calendar.HOUR_OF_DAY, 0)
        currentDay.set(Calendar.MINUTE, 0)
        currentDay.set(Calendar.SECOND, 0)
        currentDay.set(Calendar.MILLISECOND, 0)

        //以明天为界限，一直统计到今天为止
        val tomorrow = Calendar.getInstance()
        tomorrow.set(Calendar.HOUR_OF_DAY, 0)
        tomorrow.set(Calendar.MINUTE, 0)
        tomorrow.set(Calendar.SECOND, 0)
        tomorrow.set(Calendar.MILLISECOND, 0)
        tomorrow.add(Calendar.DAY_OF_MONTH, 1)

        val byDay = ChartsStatVo.OrderCountsByDate()
        val byMonth = ChartsStatVo.OrderCountsByDate()

        val byDayFormatter = SimpleDateFormat("yyyy-MM-dd")
        val byMonthFormatter = SimpleDateFormat("yyyy-MM")

        logger.info("Time spent ${System.currentTimeMillis() - startTime}ms.(fetch)")

        var byMonthCountOfGuLou = 0
        var byMonthCountOfXianLin = 0

        var orderListIndex = 0
        while (currentDay.before(tomorrow)) {
            var countOfGuLou = 0
            var countOfXianLin = 0

            val nextDay = Calendar.getInstance()
            nextDay.time = currentDay.time
            nextDay.add(Calendar.DAY_OF_MONTH, 1)

            while (orderListIndex < orderList.size && orderList[orderListIndex].createTime.before(nextDay.time)) {
                if (orderList[orderListIndex].campus == CampusEnum.GULOU) {
                    ++countOfGuLou
                } else {
                    ++countOfXianLin
                }
                ++orderListIndex
            }

            byDay.append(
                byDayFormatter.format(currentDay.time),
                guLouCount = countOfGuLou,
                xianLinCount = countOfXianLin
            )

            byMonthCountOfGuLou += countOfGuLou
            byMonthCountOfXianLin += countOfXianLin

            if (nextDay.get(Calendar.DAY_OF_MONTH) < currentDay.get(Calendar.DAY_OF_MONTH)) {
                //今天是当月最后一天，记录下当月数据
                byMonth.append(
                    byMonthFormatter.format(currentDay.time),
                    guLouCount = byMonthCountOfGuLou,
                    xianLinCount = byMonthCountOfXianLin
                )
                byMonthCountOfGuLou = 0
                byMonthCountOfXianLin = 0
            }

            currentDay.add(Calendar.DAY_OF_MONTH, 1)
        }

        if (currentDay.get(Calendar.DAY_OF_MONTH) != 1) {
            //现在这个月的数据
            byMonth.append(
                byMonthFormatter.format(currentDay.time),
                guLouCount = byMonthCountOfGuLou,
                xianLinCount = byMonthCountOfXianLin
            )
        }

        val endTime = System.currentTimeMillis()
        logger.info("Time spent ${endTime - startTime}ms.")

        return Pair(byDay, byMonth)
    }

    private fun getExpTagsStat(): ChartsStatVo.ExpTags {
        val tagNameList = mutableListOf<String>()
        val tagCountList = mutableListOf<Int>()
        orderRecordTagRepository.findAll().sortedBy { it.referCount }
            .forEach {
                tagNameList.add(it.name)
                tagCountList.add(it.referCount)
            }
        return ChartsStatVo.ExpTags(
            tagNameList = tagNameList,
            tagCountList = tagCountList
        )
    }

}
