package cn.itxia.api.response

/**
 * 用于包装返回值，顺便提供code来让前端识别错误类型.
 * */
enum class ResponseCode(val code: Int, val message: String) {

    SUCCESS(0, "请求成功"),
    INCORRECT_PARAM_FORMAT(1, "参数格式不正确"),
    UNAUTHORIZED(2, "无此权限"),
    UNAUTHENTICATED(3, "用户认证失败，请登录"),
    INCORRECT_PASSWORD(4, "用户名或密码不正确"),
    FILE_UPLOAD_FAIL(5, "文件上传失败"),
    FILE_NOT_FOUND(6, "未找到文件"),
    INVALID_PARAM(7, "参数错误"),
    NO_SUCH_ORDER(8, "无此预约单"),
    ORDER_STATUS_INCORRECT(9, "预约单状态不对"),
    REQUEST_SIZE_EXCEEDED(10, "附件过大"),
    NO_OAUTH_ID_FOUND(11, "未找到OAuth ID"),
    ACCOUNT_NOT_ENABLE(12, "此账号未启用"),
    NO_SUCH_MEMBER(13, "无此账号"),
    INVALID_REDEEM_CODE(14, "邀请码无效"),
    LOGIN_NAME_ALREADY_EXISTED(15, "登录ID已存在"),
    QQ_OAUTH_LOGIN_SUCCESSFUL(16, "QQ OAuth登录成功"),
    QQ_OAUTH_BIND_SUCCESSFUL(17, "QQ OAuth绑定成功"),
    ORDER_TAG_ALREADY_EXISTED(18, "同名标签已存在"),
    ORDER_TAG_NOT_DELETED(19, "标签未删除，可能是标签已被引用过"),
    UNKNOWN_ERROR(999, "未知错误"),

    ;

    fun withPayload(payload: Any?): Response {
        return ResponseCodeWithPayload(this.code, this.message, payload)
    }

    fun withoutPayload(): Response {
        return ResponseCodeWithPayload(this.code, this.message, null)
    }


    private class ResponseCodeWithPayload(val code: Int, val message: String, val payload: Any?) : Response
}

interface Response
