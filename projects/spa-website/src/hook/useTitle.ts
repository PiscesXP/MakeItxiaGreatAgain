/**
 * 更改标题.
 * */
function useTitle(title: string) {
  document.title = title;
}

function useTitleWCMS(prefix: string) {
  return useTitle(prefix + " - IT侠后台管理系统");
}

function useTitleCustom(prefix: string) {
  return useTitle(prefix + " - IT侠预约系统");
}

export { useTitle, useTitleCustom, useTitleWCMS };
