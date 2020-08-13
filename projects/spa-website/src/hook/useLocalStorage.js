import { useState } from "react";

/**
 * 存储localstorage.
 * 自动使用JSON序列化/反序列化.
 * @param key {string} localstorage key
 * */
function useLocalStorage(key) {
  const [item, setItem] = useState(() => {
    const localStorageValue = window.localStorage.getItem(key);
    let initialState;
    if (localStorageValue !== "undefined") {
      try {
        initialState = JSON.parse(localStorageValue);
      } catch (e) {
        console.log(`Error while parsing localstorage:${key}`);
      }
    }
    return initialState;
  });

  function set(value) {
    window.localStorage.setItem(key, JSON.stringify(value));
    setItem(value);
  }

  function remove() {
    window.localStorage.removeItem(key);
    setItem(null);
  }

  return [item, set, remove];
}

export { useLocalStorage };
