import { useCallback } from "react";
import { usePersistFn } from "@/hook/usePersisFn";
import { throttle } from "@/util/debounce";

declare type noop = (...args: any) => any;

export function useThrottle<T extends noop>(fn: T, interval = 1000) {
  const persistFn = usePersistFn(fn);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(throttle(persistFn, interval), []);
}
