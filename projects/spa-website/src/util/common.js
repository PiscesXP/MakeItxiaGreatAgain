function throttleFn(fn, delay = 1000) {
  let previous = 0;
  return function (...args) {
    const current = Date.now();
    if (current - previous > delay) {
      previous = current;
      const context = this;
      fn.apply(context, args);
    }
  };
}

function debounceFn(fn, delay = 1000) {
  let timer = null;
  return (...args) => {
    clearTimeout(timer);
    const context = this;
    timer = setTimeout(() => {
      fn.apply(context, args);
    }, delay);
  };
}

export { debounceFn, throttleFn };
