import { config } from "CONFIG";
import { toQuerystring } from "@/util/query";
import {
  ApiRequestParam,
  ApiRequestResult,
  ApiRequestStateEnum,
  RequestQuery,
} from "@/request/types";

const urlPrefix = config.network.api.prefix;
const origin = config.network.api.origin;

/**
 * 构造url.
 * protocol + host + path + qs.
 * */
function buildUrl(path: string, query?: RequestQuery): string {
  const qs = toQuerystring(query);
  return `${urlPrefix}${path}${qs}`;
}

/**
 * 发起Api请求.
 * */
async function sendApiRequest({
  path,
  method = "GET",
  requestBody = null,
  requestQuery,
}: ApiRequestParam): Promise<ApiRequestResult> {
  if (requestBody && (method === "POST" || method === "PUT")) {
    requestBody = JSON.stringify(requestBody);
  }
  let response;
  try {
    response = await fetch(buildUrl(path, requestQuery), {
      body: requestBody,
      headers: {
        "content-type": "application/json",
        "itxia-from": origin,
      },
      method,
    });
  } catch (e) {
    //TODO 改写error message
    return {
      state: ApiRequestStateEnum.error,
      error: new Error(`网络连接失败. ${e && e.toString()}`),
    };
  }
  if (!response.ok) {
    return {
      state: ApiRequestStateEnum.error,
      error: new Error(`网络错误[${response.status}]`),
    };
  }
  try {
    const json = await response.json();
    if (typeof json.code === "number") {
      return {
        state:
          json.code === 0
            ? ApiRequestStateEnum.success
            : ApiRequestStateEnum.fail,
        data: json,
      };
    } else {
      return {
        state: ApiRequestStateEnum.error,
        error: new Error("返回数据格式错误"),
      };
    }
  } catch (e) {
    return {
      state: ApiRequestStateEnum.error,
      error: new Error("json数据格式解析失败"),
    };
  }
}

const GET = (path: string, requestQuery?: RequestQuery) => {
  return sendApiRequest({ path, method: "GET", requestQuery });
};
const POST = (path: string, requestBody?: any, requestQuery?: RequestQuery) => {
  return sendApiRequest({ path, method: "POST", requestBody, requestQuery });
};
const PUT = (path: string, requestBody?: any, requestQuery?: RequestQuery) => {
  return sendApiRequest({ path, method: "PUT", requestBody, requestQuery });
};
const DELETE = (path: string, requestQuery?: RequestQuery) => {
  return sendApiRequest({ path, method: "DELETE", requestQuery });
};

export { sendApiRequest, GET, POST, PUT, DELETE };
