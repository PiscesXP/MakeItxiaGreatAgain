import { QuerystringObject, RequestQuery } from "@/request/types";

/**
 * 将任意值转换为query string.
 * */
export function toQuerystring(query: RequestQuery): string {
  if (query === null || query === undefined) {
    return "";
  }
  if (typeof query === "string") {
    if (query.length > 1 && query.charAt(0) !== "?") {
      return encodeURI("?" + query);
    }
    return encodeURI(query);
  }
  if (typeof query === "object") {
    let qs = "";
    for (const key in query) {
      if (query.hasOwnProperty(key) && query[key]) {
        qs += `&${key}=`;
        const value = query[key];
        if (Array.isArray(value)) {
          qs += value.join(",");
        } else {
          qs += value.toString();
        }
      }
    }
    qs = qs.substr(1);
    qs = "?" + qs;
    return encodeURI(qs);
  }
  return "";
}

/**
 * 可传入fn在解析时调用.
 * (例如把特定key的value转换成数组)
 * */
export function parseQuerystring(
  valueParseFn: (value: any, key: string) => any
): object {
  const result: QuerystringObject = {};
  const qs = window.location.search;
  qs.substr(1)
    .split("&")
    .filter((pair) => pair.length > 0)
    .forEach((pair) => {
      const [key, value] = pair.split("=");
      result[key] = valueParseFn(value, key);
    });
  return result;
}

//@ts-ignore
//compatible for old code
//TODO remove this
export const parseQueryString = parseQuerystring;
