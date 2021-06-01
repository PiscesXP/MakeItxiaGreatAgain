import { usePersistFn } from "@/hook/usePersisFn";
import { debounce } from "@/util/debounce";
import { useCallback } from "react";

declare type noop = (...args: any) => any;

function useDebounce<T extends noop>(fn: T, delay: number) {
  const persistFn = usePersistFn(fn);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(debounce(persistFn, delay), []);
}

export { useDebounce };
