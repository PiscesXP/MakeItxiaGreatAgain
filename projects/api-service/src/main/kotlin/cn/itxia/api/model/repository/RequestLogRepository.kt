package cn.itxia.api.model.repository

import cn.itxia.api.model.RequestLog
import org.springframework.data.repository.CrudRepository

interface RequestLogRepository : CrudRepository<RequestLog, String>