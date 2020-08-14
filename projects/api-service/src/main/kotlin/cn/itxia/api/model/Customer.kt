package cn.itxia.api.model

import org.springframework.data.annotation.Id

data class Customer(
        @Id
        val _id: String,

        val accessKeys: List<String>,

        val orders: List<Order>
)