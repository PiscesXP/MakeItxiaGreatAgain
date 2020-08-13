import { useEffect, useMemo, useReducer, useState } from "react";
import { sendApiRequest } from "UTIL/api";
import { EventEmitter } from "UTIL/emitter";

/**
 * 发起API请求的hook.
 * @param {string} path url path
 * @param query {string|*} query string object
 * @param method {"GET"|"POST"|"PUT"} HTTP method
 * @param data {*} request body data
 * @param later {boolean} 是否稍后手动发送请求
 * @param cleanOnRerun {boolean}
 * */
function useApi({
  path,
  query = null,
  method = "GET",
  data = null,
  later = false,
  cleanOnRerun = false
}) {
  const [loading, setLoading] = useState(!later);
  const [code, setCode] = useState(null);
  const [message, setMessage] = useState(null);
  const [payload, setPayload] = useState(null);
  const [error, setError] = useState(null);
  const [seq, nextSeq] = useReducer(previousSeq => previousSeq + 1, 0);

  const emitter = useMemo(() => new ApiEmitter(), []);

  /**
   * 发送请求.
   * */
  async function run({ requestBody = data, queryObject = query }) {
    nextSeq();
    const currentSeq = seq;
    setLoading(true);
    emitter.emitLoading();
    try {
      const result = await sendApiRequest({
        path,
        method,
        query: queryObject,
        requestBody
      });
      if (currentSeq === seq) {
        setCode(result.code);
        setMessage(result.message);
        setPayload(result.payload);
        if (result.code === 0) {
          emitter.emitSuccess({
            code: result.code,
            message: result.message,
            payload: result.payload
          });
        } else {
          emitter.emitFail({
            code: result.code,
            message: result.message,
            payload: result.payload
          });
          emitter.emitFailOrError();
        }
      }
    } catch (e) {
      if (currentSeq === seq) {
        setError(e);
        emitter.emitError(e);
        emitter.emitFailOrError();
      }
    } finally {
      if (currentSeq === seq) {
        setLoading(false);
        emitter.emitRequestDone();
      }
    }
  }

  /**
   * 手动发送请求方法.
   * @param requestBody {*?}
   * @param queryObject {*|string?}
   * */
  function send(requestBody = data, queryObject = query) {
    if (cleanOnRerun) {
      setCode(null);
      setMessage(null);
      setPayload(null);
      setError(null);
    }
    run({ requestBody, queryObject });
  }

  function clean() {
    nextSeq();
  }

  useEffect(() => {
    if (!later) {
      send();
    }
    return () => {
      clean();
    };
  }, []);

  function isSent() {
    return seq !== 0;
  }

  /**
   * 判断是否在重新加载.
   * 此时loading但payload中有数据.
   * */
  function hasData() {
    return code === 0 && payload !== null && payload !== undefined;
  }

  /**
   * 检查请求是否完成并且返回值code为0.
   * */
  function isSuccess() {
    return isSent() && !loading && code === 0;
  }

  return {
    loading,
    code,
    message,
    payload,
    error,
    send,
    isSuccess,
    isSent,
    hasData,
    emitter
  };
}

class ApiEmitter extends EventEmitter {
  emitLoading(...args) {
    this.emit("loading", ...args);
    return this;
  }
  onLoading(callback) {
    this.listen("loading", callback);
    return this;
  }

  emitSuccess(...args) {
    this.emit("success", ...args);
    return this;
  }
  onSuccess(callback) {
    this.listen("success", callback);
    return this;
  }

  emitFail(...args) {
    this.emit("fail", ...args);
    return this;
  }
  onFail(callback) {
    this.listen("fail", callback);
    return this;
  }

  emitError(...args) {
    this.emit("error", ...args);
    return this;
  }
  onError(callback) {
    this.listen("error", callback);
    return this;
  }

  emitFailOrError(...args) {
    this.emit("fail or error", ...args);
    return this;
  }
  onFailOrError(callback) {
    this.listen("fail or error", callback);
    return this;
  }

  emitRequestDone(...args) {
    this.emit("done", ...args);
    return this;
  }
  onRequestDone(callback) {
    this.listen("done", callback);
    return this;
  }
}

export { useApi };
