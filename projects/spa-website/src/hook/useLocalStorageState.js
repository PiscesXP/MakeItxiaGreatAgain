import { useState } from "react";

/**
 * 使用LocalStorage保持的值作为state.
 * 更新时也会写入LocalStorage.
 * @param key {string} LocalStorage key
 * @param init {function|Object?} Initial value, or function returns initial value
 * @param transform {function} transform state while set new value
 * */
function useLocalStorageState({ key, init = null, transform = null }) {
  const [state, setState] = useState(getInitValue());

  /**
   * 从LocalStorage获取初始值.
   * 若不存在，则使用init的值.
   * @return initial value
   * */
  function getInitValue() {
    const value = localStorage.getItem(key);
    try {
      return JSON.parse(value);
    } catch (e) {}
    if (typeof init === "function") {
      return init();
    }
    return init;
  }

  function updateState(newState) {
    if (newState === undefined) {
      localStorage.removeItem(key);
      setState(undefined);
    } else {
      if (typeof transform === "function") {
        newState = transform(newState);
      }
      localStorage.setItem(key, JSON.stringify(newState));
      setState(newState);
    }
  }

  return [state, updateState];
}

export { useLocalStorageState };
