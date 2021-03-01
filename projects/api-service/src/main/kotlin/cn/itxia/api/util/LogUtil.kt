package cn.itxia.api.util

import org.apache.logging.log4j.LogManager
import org.apache.logging.log4j.Logger

inline fun <reified T : Any> T.getLogger(): Logger {
    return LogManager.getLogger(T::class.java)
}
