package cn.itxia.api.model.repository

import cn.itxia.api.model.OrderRecord
import org.springframework.data.repository.PagingAndSortingRepository

interface OrderRecordRepository : PagingAndSortingRepository<OrderRecord, String>
