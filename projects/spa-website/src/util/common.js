function throttleFn(fn, delay = 1000) {
  let previous = 0;
  return function(...args) {
    const current = Date.now();
    if (current - previous > delay) {
      previous = current;
      const context = this;
      fn.apply(context, args);
    }
  };
}

export { throttleFn };
