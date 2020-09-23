import { useEffect, useRef } from "react";

/**
 * 只在更新时调用的effect.
 * */
function useUpdateEffect(
  effect: (...args: any[]) => any,
  deps: ReadonlyArray<any>[]
) {
  const isMounted = useRef(false);

  useEffect(() => {
    let cleanUp: any;
    if (!isMounted.current) {
      isMounted.current = true;
    } else {
      cleanUp = effect();
    }
    return cleanUp;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

export { useUpdateEffect };
