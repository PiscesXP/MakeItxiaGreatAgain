import { config } from "CONFIG";
import { buildQueryString } from "UTIL/query";

const urlPrefix = config.network.api.prefix;
const origin = config.network.api.origin;

//-------------------------------------------------------------
/**
 * @param path {string}
 * @param query {string|*}
 * */
function buildUrl(path, query = null) {
  const qs = buildQueryString(query);
  return `${urlPrefix}${path}${qs}`;
}

/**
 * @param path {string}
 * @param query {string|*}
 * @param method {"GET"|"POST"|"PUT"|"DELETE"}
 * @param requestBody {*}
 * @param signal {AbortSignal}
 * */
async function sendApiRequest({
  path,
  query = null,
  method = "GET",
  requestBody = null,
  signal = null,
}) {
  let body;
  if (method !== "GET" && requestBody) {
    body = JSON.stringify(requestBody);
  }
  let response, json;
  try {
    response = await fetch(buildUrl(path, query), {
      body,
      headers: {
        "content-type": "application/json",
        "itxia-from": origin,
      },
      method,
      signal,
    });
  } catch (e) {
    //TODO 改写error message
    return Promise.reject(new Error("网络连接失败"));
  }
  if (!response.ok) {
    return Promise.reject(new Error(`网络错误[${response.status}]`));
  }
  try {
    json = await response.json();
  } catch (e) {
    //TODO 改写error message
    return Promise.reject(new Error("json解析失败"));
  }
  const { code, message, payload } = json;
  const isSuccess = code === 0;
  return { code, message, payload, isSuccess };
}

const GET = (path, query) => {
  return sendApiRequest({ path, query, method: "GET" });
};
const POST = (path, data, query) => {
  return sendApiRequest({ path, query, method: "POST", requestBody: data });
};
const PUT = (path, data, query) => {
  return sendApiRequest({ path, query, method: "PUT", requestBody: data });
};
const DELETE = (path, query) => {
  return sendApiRequest({ path, query, method: "DELETE" });
};

export { sendApiRequest, GET, POST, PUT, DELETE };
