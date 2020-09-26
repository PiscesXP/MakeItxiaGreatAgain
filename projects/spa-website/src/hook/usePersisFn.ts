import { useCallback, useRef } from "react";

declare type noop = (...args: any[]) => any;

/**
 * 保证函数调用地址不发生变化.
 * */
function usePersistFn<T extends noop>(fn: T | undefined) {
  const ref = useRef<any>(() => {
    throw new Error("Cannot call function while rendering.");
  });

  ref.current = fn;

  return useCallback(
    ((...args) => {
      if (typeof ref.current === "function") {
        return ref.current(...args);
      }
    }) as T,
    []
  );
}

export { usePersistFn };
