package cn.itxia.api.util

import at.favre.lib.crypto.bcrypt.BCrypt
import java.nio.charset.StandardCharsets

class PasswordUtil {

    companion object {

        /**
         * 默认用UTF-8编码.
         * */
        private val charset = StandardCharsets.UTF_8

        /**
         * BCrypt的cost参数.
         * */
        private const val cost = 6

        /**
         * 加密密码.
         * */
        fun encrypt(password: String): String {
            val encryptedPasswordByteArray = BCrypt.withDefaults().hash(cost, password.toByteArray(charset))
            return String(encryptedPasswordByteArray, charset)
        }

        /**
         * 验证密码.
         * */
        fun verify(rawPassword: String, encryptedPassword: String): Boolean {
            val verifyResult = BCrypt.verifyer().verify(
                    rawPassword.toByteArray(charset),
                    encryptedPassword.toByteArray(charset)
            )
            return verifyResult.validFormat && verifyResult.verified
        }

    }

}