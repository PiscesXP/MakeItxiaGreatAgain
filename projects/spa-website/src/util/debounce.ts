declare type noop = (...args: any) => any;

function debounce<T extends noop>(fn: T, delay: number = 0) {
  let timer: any;
  return function (...args: any[]) {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    //why this is NodeJS.Timeout but not number?
    timer = setTimeout(() => {
      fn(...args);
    }, delay);
  } as T;
}

function throttle<T extends noop>(fn: T, interval: number = 0) {
  let lastInvokeTime = 0;
  let lastCallTime: number;
  let lastArgs: any;
  let hasPendingInvoke = false;
  let isInvoking = false;

  /**
   * Immediately invoke fn.
   * After interval time, check if there is pending invoke.
   * */
  function invoke(...args: any) {
    lastInvokeTime = Date.now();
    isInvoking = true;
    fn(...args);
    setTimeout(() => {
      //check if there is pending invoke
      if (hasPendingInvoke) {
        hasPendingInvoke = false;
        invoke(lastArgs);
      } else {
        isInvoking = false;
      }
    }, interval);
  }

  return function (...args: any) {
    lastCallTime = Date.now();
    if (lastCallTime - lastInvokeTime >= interval && !isInvoking) {
      invoke(...args);
    } else {
      hasPendingInvoke = true;
      lastArgs = args;
    }
  } as T;
}

export { debounce, throttle };
