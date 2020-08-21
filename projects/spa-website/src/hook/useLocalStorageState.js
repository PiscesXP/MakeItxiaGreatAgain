import { useCallback, useState } from "react";

/**
 * @param key {string}
 * @param init {function|Object?}
 * @param transform {function}
 * */
function useLocalStorageState({ key, init = null, transform = (a) => a }) {
  const [state, setState] = useState(() => {
    //从localStorage中读取初始值，若不存在则使用init
    function getInit() {
      let initValue;
      if (typeof init === "function") {
        initValue = init();
      } else {
        initValue = init;
      }
      window.localStorage.setItem(key, JSON.stringify(initValue));
      return initValue;
    }
    const rawValue = window.localStorage.getItem(key);
    if (rawValue === null || rawValue === "undefined") {
      return getInit();
    } else {
      try {
        return JSON.parse(rawValue);
      } catch (e) {
        return getInit();
      }
    }
  });

  const set = useCallback(
    (newState) => {
      if (newState !== undefined) {
        window.localStorage.setItem(key, JSON.stringify(transform(newState)));
      } else {
        window.localStorage.removeItem(key);
      }
      setState(newState);
    },
    [key, transform, setState]
  );

  return [state, set];
}

export { useLocalStorageState };
