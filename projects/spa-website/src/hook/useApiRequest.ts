import { useCallback, useEffect, useReducer, useRef } from "react";
import { usePersistFn } from "@/hook/usePersisFn";
import { sendApiRequest } from "@/request/api";
import {
  ApiRequestData,
  ApiRequestParam,
  ApiRequestStateEnum,
  RequestMethod,
  RequestQuery,
} from "@/request/types";
import { ModalParam, popModalOnApiResult } from "@/util/modalUtil";

interface UseApiInternalState {
  loading: boolean;
  code: number | null;
  message: string | null;
  payload: any | null;
  error: Error | null;
}
interface UseApiReducerAction {
  seq?: number;
  type: "load" | "done" | "error" | "mutate";
  data?: ApiRequestData;
  error?: Error;
  mutatedPayload?: any;
}

declare type FormatResult = (payload: any) => any;

interface ManualSendParam {
  path?: string;
  method?: RequestMethod;
  requestQuery?: RequestQuery;
  requestBody?: any;
}

interface UseApiRequestParam extends ApiRequestParam {
  manual?: boolean;
  //直接改变payload
  formatResult?: FormatResult;
  onLoad?: () => void;
  onSuccess?: (data: ApiRequestData) => void;
  onFail?: (data: ApiRequestData) => void;
  onError?: (error: Error) => void;
  onUnsuccessful?: () => void;
  popModal?: ModalParam;
}

/**
 * 发起API请求.
 * */
function useApiRequest({
  path,
  method = "GET",
  requestBody,
  requestQuery,
  manual = false,
  formatResult,
  onLoad,
  onSuccess,
  onFail,
  onError,
  onUnsuccessful,
  popModal,
}: UseApiRequestParam) {
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
    (): UseApiInternalState => ({
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
  const stateReducer = useCallback<
    (
      state: UseApiInternalState,
      action: UseApiReducerAction
    ) => UseApiInternalState
  >(
    (state, action): UseApiInternalState => {
      //校验请求序号.
      //如果不是最新值，表明已经有新的请求，因此跳过此次更新.
      if (typeof action.seq === "number" && seqRef.current !== action.seq) {
        return state;
      }

      let newState;
      switch (action.type) {
        case "load":
          if (onLoad) {
            onLoad();
          }
          newState = {
            loading: true,
          };
          break;
        case "done":
          //请求完成
          if (action.data) {
            const { code, message } = action.data;
            let { payload } = action.data;
            if (typeof formatResult === "function") {
              payload = formatResult(payload);
            }
            newState = {
              loading: false,
              code: code,
              message: message,
              payload: payload,
              error: null,
            };
            //调用回调
            const cloneData = { ...action.data };
            if (code === 0) {
              setTimeout(() => {
                onSuccess && onSuccess(cloneData);
              }, 0);
            } else {
              setTimeout(() => {
                onFail && onFail(cloneData);
                onUnsuccessful && onUnsuccessful();
              }, 0);
            }
          }
          break;
        case "error":
          //请求发生错误
          let error = action.error || new Error("网络请求错误");
          newState = {
            loading: false,
            code: null,
            message: null,
            payload: null,
            error: error,
          };
          setTimeout(() => {
            onError && onError(error);
            onUnsuccessful && onUnsuccessful();
          }, 0);
          break;
        case "mutate":
          //直接改变请求结果
          newState = {
            payload: action.mutatedPayload,
          };
          break;
        default:
          console.log("Unrecognized action.");
          return state;
      }
      return Object.assign({}, state, newState);
    },
    [formatResult, onLoad, onSuccess, onFail, onError, onUnsuccessful]
  );

  /**
   * 状态.
   * */
  const [reducerState, dispatch] = useReducer(stateReducer, null, init);

  /**
   * 发送请求.
   * */
  const sendRequest = usePersistFn((args: ManualSendParam) => {
    //记录当前请求的序号.
    seqRef.current = seqRef.current + 1;
    const currentSeq = seqRef.current;

    const actualArgs: ApiRequestParam = {
      path,
      method,
      requestBody,
      requestQuery,
      ...args,
    };

    dispatch({
      seq: currentSeq,
      type: "load",
    });
    sendApiRequest(actualArgs)
      .then((result) => {
        const { state, data, error } = result;
        if (state === ApiRequestStateEnum.error) {
          dispatch({
            seq: currentSeq,
            type: "error",
            error: error,
          });
        } else {
          dispatch({
            seq: currentSeq,
            type: "done",
            data: data,
          });
        }
        //弹出Modal
        setTimeout(() => {
          popModalOnApiResult({
            result,
            ...popModal,
          });
        }, 0);
      })
      .catch((error) => {
        //this should never happen
        console.log(`Should never happen. ${error?.toString()}`);
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
   * */
  const mutate = usePersistFn(function <T>(arg: (previousPayload: T) => T) {
    dispatch({
      type: "mutate",
      mutatedPayload: arg(reducerState.payload),
    });
  });

  useEffect(() => {
    if (!manual) {
      sendRequest();
    }

    return () => {
      abort();
    };
  }, [abort, manual, sendRequest]);

  return {
    ...reducerState,
    mutate,
    sendRequest,
    abort,
  };
}

export { useApiRequest };
