import { useState } from "react";

/**
 * @param init {string}
 * */
function useTitle(init) {
  const [state, setState] = useState(init);
  document.title = init;
  function set(newTitle) {
    setState(newTitle);
    document.title = newTitle;
  }
  return [state, set];
}

function useTitleWCMS(prefix) {
  return useTitle(prefix + " - IT侠后台管理系统");
}

function useTitleCustom(prefix) {
  return useTitle(prefix + " - IT侠预约系统");
}

export { useTitle, useTitleCustom, useTitleWCMS };
