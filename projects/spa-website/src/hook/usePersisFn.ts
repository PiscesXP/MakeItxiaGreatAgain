import { useCallback, useRef } from "react";

declare type noop = (...args: any[]) => any;

/**
 * 保证函数调用地址不发生变化.
 * */
function usePersistFn<T extends noop>(fn: T) {
  const ref = useRef<any>(() => {
    throw new Error("Cannot call function while rendering.");
  });

  ref.current = fn;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(((...args) => ref.current(...args)) as T, []);
}

/**
 * 允许传入undefined或null, 此时fn由fallback代替.
 * */
function useOptionalPersistFn<T extends noop>(
  fn: T | undefined | null,
  fallback: T
) {
  if (typeof fn !== "function") {
    fn = fallback;
  }
  return usePersistFn(fn);
}

export { usePersistFn, useOptionalPersistFn };
