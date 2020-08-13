/**
 * @param fn {function}
 * @param delay {number} delay time in ms.
 * */
import { useMemo } from "react";

function useThrottle(fn, delay = 1000) {
  //得用memo，否则rerender后会重新创建闭包变量previousTime
  return useMemo(() => {
    let previousTime = 0;
    return (...args) => {
      const currentTime = Date.now();
      if (currentTime - previousTime > delay) {
        previousTime = currentTime;
        fn(...args);
      }
    };
  }, [fn, delay]);
}

export { useThrottle };
