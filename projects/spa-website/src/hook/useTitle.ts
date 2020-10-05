import { useEffect, useRef } from "react";

/**
 * 更改标题.
 * */
function useTitle(title: string, recoverOnUnmount: boolean = true) {
  const ref = useRef<string>(title);
  document.title = title;

  useEffect(() => {
    const initialTitle = ref.current;
    return () => {
      if (recoverOnUnmount) {
        document.title = initialTitle;
      }
    };
  }, [recoverOnUnmount]);
}

function useTitleWCMS(prefix: string, recoverOnUnmount?: boolean) {
  return useTitle(prefix + " - IT侠后台管理系统", recoverOnUnmount);
}

function useTitleCustom(prefix: string, recoverOnUnmount?: boolean) {
  return useTitle(prefix + " - IT侠预约系统");
}

export { useTitle, useTitleCustom, useTitleWCMS };
