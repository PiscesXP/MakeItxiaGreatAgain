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

export interface ApiRequestArgs {
  path: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  requestQuery?: RequestQuery;
  requestBody?: any;
}
