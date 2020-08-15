import { config } from "CONFIG";
import { buildQueryString } from "UTIL/query";

const urlPrefix = (() => {
  const { host, protocol } = config.network.api;
  return protocol + "://" + host;
})();

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
 * @param method {"GET"|"POST"|"PUT"}
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
      credentials: "include",
      headers: {
        "content-type": "application/json",
      },
      method,
      mode: "cors",
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

export { sendApiRequest, GET, POST, PUT };
