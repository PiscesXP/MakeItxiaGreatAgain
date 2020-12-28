package cn.itxia.api.model.repository

import cn.itxia.api.enum.CampusEnum
import cn.itxia.api.enum.OrderStatusEnum
import cn.itxia.api.model.ItxiaMember
import cn.itxia.api.model.Order
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.repository.PagingAndSortingRepository
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface OrderRepository : PagingAndSortingRepository<Order, String> {

    fun findBy_idAndDeletedFalse(id: String): Order?

    override fun findAll(pageable: Pageable): Page<Order>

    fun countByStatusAndDeletedFalse(status: OrderStatusEnum): Int

    fun countByCampusAndStatusAndCreateTimeBeforeAndDeletedFalse(campus: CampusEnum, status: OrderStatusEnum, createTimeBefore: Date): Int

    fun countByHandlerAndStatusAndDeletedFalse(handler: ItxiaMember.BaseInfoOnly, status: OrderStatusEnum): Int

    fun findAllByDeletedFalse(): List<Order>


    fun findByCampusInAndStatusInAndDeletedFalse(campus: Collection<CampusEnum>, status: Collection<OrderStatusEnum>, pageable: Pageable): List<Order>

    fun countByCampusInAndStatusInAndDeletedFalse(campus: Collection<CampusEnum>, status: Collection<OrderStatusEnum>): Int


    fun findByCampusInAndStatusInAndHandlerAndDeletedFalse(campus: Collection<CampusEnum>, status: Collection<OrderStatusEnum>, handler: ItxiaMember.BaseInfoOnly, pageable: Pageable): List<Order>

    fun countByCampusInAndStatusInAndHandlerAndDeletedFalse(campus: Collection<CampusEnum>, status: Collection<OrderStatusEnum>, handler: ItxiaMember.BaseInfoOnly): Int

}
