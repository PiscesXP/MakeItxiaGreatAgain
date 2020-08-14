package cn.itxia.api.util

class MongoUtil {

    companion object {

        private val objectIDRegExpSchema = Regex("^[0-9a-f]{24}$")

        /**
         * 验证ObjectID格式.
         * */
        fun isObjectID(objectID: String): Boolean {
            if (objectIDRegExpSchema.matches(objectID)) {
                return true
            }
            return false
        }
    }
}