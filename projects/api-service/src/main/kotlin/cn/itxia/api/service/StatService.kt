package cn.itxia.api.service

import cn.itxia.api.enum.CampusEnum
import cn.itxia.api.enum.OrderStatusEnum
import cn.itxia.api.model.ItxiaMember
import cn.itxia.api.model.repository.OrderRepository
import cn.itxia.api.vo.StatOfAllVo
import cn.itxia.api.vo.StatOfMemberVo
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.util.*

@Service
class StatService {

    @Autowired
    private lateinit var orderRepository: OrderRepository

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

}
