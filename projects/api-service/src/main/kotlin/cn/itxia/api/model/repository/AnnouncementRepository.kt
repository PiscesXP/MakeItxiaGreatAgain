package cn.itxia.api.model.repository

import cn.itxia.api.enum.AnnouncementTypeEnum
import cn.itxia.api.model.Announcement
import org.springframework.data.repository.PagingAndSortingRepository

interface AnnouncementRepository : PagingAndSortingRepository<Announcement, String> {

    fun findByType(type: AnnouncementTypeEnum): List<Announcement>

}
