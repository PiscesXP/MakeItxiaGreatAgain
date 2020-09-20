import { useCallback, useEffect, useReducer, useRef } from "react";
import { usePersistFn } from "HOOK/usePersisFn";
import { sendApiRequest } from "UTIL/api";

/**
 * @typedef {Object} ApiRequestResult
 * @property {number} code
 * @property {string} message
 * @property {*} payload
 * */
/**
 * @callback requestCallback
 * @param result {ApiRequestResult}
 * */
/**
 * @callback requestErrorCallback
 * @param error {Error}
 * */
/**
 * @callback apiRequestResultFormatter
 * @param {ApiRequestResult} result
 * */

/**
 * @callback useApiRequestSend
 * @param {Object?} requestBody
 * @param {Object|string?} queryObject
 * */
/**
 * @typedef {Object} useApiRequestResult
 * @property {number} code
 * @property {string} message
 * @property {*} payload
 * @property {useApiRequestSend} send
 *
 * */

/**
 * 发起API请求.
 *
 * @param {string} path
 * @param {Object|string} query
 * @param {"GET"|"POST"|"PUT"|"DELETE"} method
 * @param {Object} data
 * @param {boolean} manual
 * @param {apiRequestResultFormatter} formatResult
 * @param {function} onLoad
 * @param {requestCallback} onSuccess
 * @param {requestCallback} onFail
 * @param {requestErrorCallback} onError
 * @param {function} onUnsuccessful
 *
 * @return {useApiRequestResult}
 * */
function useApiRequest({
  path,
  query = null,
  method = "GET",
  data = null,
  manual = false,
  formatResult = null,
  onLoad = null,
  onSuccess = null,
  onFail = null,
  onError = null,
  onUnsuccessful = null,
}) {
  onLoad = usePersistFn(onLoad);
  onSuccess = usePersistFn(onSuccess);
  onFail = usePersistFn(onFail);
  onError = usePersistFn(onError);
  onUnsuccessful = usePersistFn(onUnsuccessful);

  formatResult = usePersistFn(formatResult);

  const seqRef = useRef(0);

  /**
   * 初始化state.
   * */
  const init = useCallback(
    () => ({
      loading: false,
      code: null,
      message: null,
      payload: null,
      error: null,
    }),
    []
  );

  /**
   * state的reducer.
   * */
  const stateReducer = useCallback(
    (state, action) => {
      //校验请求序号.
      //如果不是最新值，表明已经有新的请求，因此跳过此次更新.
      if (seqRef.current !== action.seq) {
        return state;
      }

      let newState;
      switch (action.type) {
        case "load":
          onLoad();
          newState = {
            loading: true,
          };
          break;
        case "done":
          //请求完成
          newState = {
            loading: false,
            code: action.data.code,
            message: action.data.message,
            payload: action.data.payload,
            error: null,
          };
          setTimeout(() => {
            if (action.data.code === 0) {
              //成功时的回调
              onSuccess && onSuccess(action.data);
            } else {
              //失败的回调
              onFail && onFail(action.data);
              onUnsuccessful && onUnsuccessful();
            }
          }, 0);
          break;
        case "error":
          //请求发生错误
          newState = {
            loading: false,
            code: null,
            message: null,
            payload: null,
            error: action.error,
          };
          setTimeout(() => {
            onError && onError(action.error);
            onUnsuccessful && onUnsuccessful();
          }, 0);
          break;
        case "mutate":
          //直接改变请求结果
          newState = {
            payload: action.data,
          };
          break;
        default:
          console.log("Unrecognized action.");
          return state;
      }
      return Object.assign({}, state, newState);
    },
    [onLoad, onSuccess, onFail, onError, onUnsuccessful]
  );

  /**
   * 状态.
   * */
  const [state, dispatch] = useReducer(stateReducer, {}, init);

  /**
   * 发送请求.
   * @callback
   * @param {Object?} requestBody
   * @param {Object|string?} queryObject
   * */
  const send = usePersistFn((requestBody = data, queryObject = query) => {
    //记录当前请求的序号.
    seqRef.current = seqRef.current + 1;
    const currentSeq = seqRef.current;

    sendApiRequest({ path, method, requestBody, query: queryObject })
      .then((result) => {
        //检查是否需要格式化数据
        let truePayload = result.payload;
        if (formatResult && truePayload) {
          truePayload = formatResult(truePayload);
        }
        //更新状态
        dispatch({
          seq: currentSeq,
          action: "done",
          data: {
            code: result.code,
            message: result.message,
            payload: truePayload,
          },
        });
      })
      .catch((error) => {
        dispatch({
          seq: currentSeq,
          action: "error",
          data: error,
        });
      });
  });

  /**
   * 终止当前请求.
   * */
  const abort = usePersistFn(() => {
    seqRef.current = seqRef.current + 1;
  });

  /**
   * 直接改变结果值.
   * @param {Object?} newData 新的值
   * */
  const mutate = usePersistFn((newData) => {
    dispatch({
      action: "mutate",
      data: newData,
    });
  });

  useEffect(() => {
    if (!manual) {
      send();
    }

    return () => {
      abort();
    };
  }, [abort, manual, send]);

  return {
    code: state.code,
    message: state.message,
    payload: state.payload,
    error: state.error,
    mutate,
    send,
    abort,
  };
}
export { useApiRequest };
