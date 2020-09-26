// eslint-disable-next-line no-shadow
export enum ApiRequestStateEnum {
  success,
  fail,
  error,
}

export interface ApiRequestResult {
  state: ApiRequestStateEnum;
  data?: ApiRequestData;
  error?: Error;
}
/**
 * API请求返回的数据.
 * */
export interface ApiRequestData {
  code: number;
  message: string;
  payload?: any;
}
export interface QuerystringObject {
  [propName: string]: any;
}
//query string
export declare type RequestQuery =
  | QuerystringObject
  | string
  | undefined
  | null;

export declare type RequestMethod = "GET" | "POST" | "PUT" | "DELETE";

export interface ApiRequestParam {
  path: string;
  method?: RequestMethod;
  requestQuery?: RequestQuery;
  requestBody?: any;
}
