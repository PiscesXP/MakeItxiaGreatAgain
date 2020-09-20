import { useCallback, useRef } from "react";

/**
 * 保证函数调用地址不发生变化.
 * @param fn {function}
 * */
function usePersistFn(fn) {
  const ref = useRef(() => {
    throw new Error("Cannot call function while rendering.");
  });

  ref.current = fn;

  return useCallback((...args) => ref.current(...args), [ref]);
}

export { usePersistFn };
