import { useCallback, useEffect, useMemo, useReducer } from "react";
import { sendApiRequest } from "UTIL/api";

/**
 * 发起API请求的hook.
 * @param {string} path 请求的url path
 * @param query {string|*} query string object
 * @param method {"GET"|"POST"|"PUT"} HTTP method
 * @param data {*} request body data
 * @param later {boolean} 是否稍后手动发送请求(不立即发送)
 * @param cleanOnRerun {boolean}
 * @param onLoad {function?} 加载时的回调
 * @param onSuccess {function?} 请求成功时code===0的回调
 * @param onFail {function?} 请求成功时code!==0的回调
 * @param onError {function?} 请求失败的回调，网络错误等等
 * @param onUnsuccessful {function?} 请求不成功(code!==0)时的回调
 *
 *
 *
 * @typedef {Object} useApiResult useApi调用的返回值
 * @property {number} seq 请求顺序ID
 * @property {boolean} loading 是否正在加载
 * @property {number|null} code 请求返回值code
 * @property {string|null} message 请求返回值message
 * @property {Object|null} payload 请求返回值payload
 * @property {Error|null} error 请求出错时的error
 * @property {function} send 手动发送请求的函数
 * @property {boolean} isSuccess 是否请求成功且code===0 (不在loading中)
 * @property {boolean} isFail 是否请求成功且code!==0 (不在loading中)
 * @property {boolean} isError 是否请求失败产生error (不在loading中)
 * @property {boolean} isUnsuccessful isFail||isError (不在loading中)
 *
 * @return {useApiResult}
 * */
function useApi({
  path,
  query = null,
  method = "GET",
  data = null,
  later = false,
  cleanOnRerun = false,
  onLoad = () => null,
  onSuccess = () => null,
  onFail = () => null,
  onError = () => null,
  onUnsuccessful = () => null,
}) {
  const handleLoad = useCallback(onLoad, []);
  const handleSuccess = useCallback(onSuccess, []);
  const handleFail = useCallback(onFail, []);
  const handleError = useCallback(onError, []);
  const handleUnsuccessful = useCallback(onUnsuccessful, []);

  //初始化reducer state
  const init = useCallback(() => {
    return {
      seq: 0,
      loading: !later,
      code: null,
      message: null,
      payload: null,
      error: null,
    };
  }, [later]);

  //reducer
  const stateReducer = useCallback((state, action) => {
    //判断是否是上一次的请求，不是则跳过
    const isPreviousRequest = action.currentSeq + 1 === state.seq;

    let newState;
    switch (action.type) {
      case "load":
        handleLoad();
        newState = {
          seq: state.seq + 1,
          loading: true,
        };
        break;
      case "reset":
        //清除已有数据
        newState = {
          code: null,
          message: null,
          payload: null,
          error: null,
        };
        break;
      case "success":
        if (!isPreviousRequest) {
          console.log("skipping request result.");
          return state;
        }
        //请求成功，不管后端返回值是否为0
        setTimeout(() => {
          if (action.data.code === 0) {
            handleSuccess(action.data);
          } else {
            handleFail(action.data);
            handleUnsuccessful(action.data);
          }
        }, 0);
        newState = {
          loading: false,
          code: action.data.code,
          message: action.data.message,
          payload: action.data.payload,
          error: null,
        };
        break;
      case "error":
        if (!isPreviousRequest) {
          console.log("skipping request result.");
          return state;
        }
        //网络错误等等...
        setTimeout(() => {
          handleError(action.error);
          handleUnsuccessful(action.error);
        }, 0);
        newState = {
          loading: false,
          code: null,
          message: null,
          payload: null,
          error: action.error,
        };
        break;
      case "destroy":
        newState = {
          seq: state.seq + 1,
        };
        break;
      default:
        console.log("Unrecognized action received");
        return state;
    }
    return Object.assign({}, state, newState);
  }, []);

  //状态
  const [state, dispatch] = useReducer(stateReducer, {}, init);

  //用于组件卸载时终止请求
  const abortController = useMemo(() => new AbortController(), []);

  /**
   * @function send
   * @param requestBody {Object?}
   * @param queryObject {Object?}
   * */
  const send = useCallback(
    async (requestBody = data, queryObject = query) => {
      const currentSeq = state.seq;
      if (cleanOnRerun) {
        dispatch({ type: "reset" });
      }
      dispatch({ type: "load", currentSeq });
      try {
        const result = await sendApiRequest({
          path,
          method,
          query: queryObject,
          requestBody,
          signal: abortController.signal,
        });
        const resultData = {
          code: result.code,
          message: result.message,
          payload: result.payload,
        };
        dispatch({ type: "success", currentSeq, data: resultData });
      } catch (e) {
        dispatch({ type: "error", currentSeq, error: e });
      }
    },
    [state.seq]
  );

  useEffect(() => {
    //初始化后自动开始请求
    if (!later) {
      send();
    }
    return () => {
      dispatch({ type: "destroy" });
      abortController.abort();
    };
  }, [dispatch, abortController, later]);

  const isSuccess = useMemo(() => {
    return !state.loading && state.code === 0;
  }, [state.loading, state.code]);

  const isFail = useMemo(() => {
    return !state.loading && state.code !== 0;
  }, [state.loading, state.code]);

  const isError = useMemo(() => {
    return !state.loading && state.error !== null && state.error !== undefined;
  }, [state.loading, state.error]);

  const isUnsuccessful = useMemo(() => {
    return isFail || isError;
  }, [isFail, isError]);

  return {
    ...state,
    isSuccess,
    isFail,
    isError,
    isUnsuccessful,
    send,
  };
}

export { useApi };
