import { useState } from "react";

function isFunction<T>(obj: any): obj is T {
  return typeof obj === "function";
}

declare type LocalStorageStateResult<T> = [
  T | undefined,
  (value: T) => void,
  () => void
];

/**
 * 使用LocalStorage保持的值作为state.
 * 更新时也会写入LocalStorage.
 *
 * @param key {string} LocalStorage key
 * @param init {function|Object?} Initial value, or function returns initial value
 * @param transform {function} transform state while set new value
 * */
function useLocalStorageState<T>(
  key: string,
  init: T | (() => T),
  transform?: (value: T) => T
): LocalStorageStateResult<T> {
  const [state, setState] = useState<T | undefined>(getInitValue());

  /**
   * 从LocalStorage获取初始值.
   * 若不存在，则使用init的值.
   * */
  function getInitValue(): T {
    const value = localStorage.getItem(key);
    try {
      if (value !== null) {
        return JSON.parse(value);
      }
    } catch (e) {}
    if (isFunction<() => T>(init)) {
      return init();
    }
    return init;
  }

  /**
   * 更新状态.
   * */
  function updateState(newState: T) {
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

  /**
   * 清除LocalStorage的值.
   * 并把state设为undefined.
   * */
  function remove() {
    localStorage.removeItem(key);
    setState(undefined);
  }

  return [state, updateState, remove];
}

export { useLocalStorageState };
