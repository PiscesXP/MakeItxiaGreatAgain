import React from "react";
import { notification, Spin } from "antd";
import { routePath } from "@/page/routePath";
import { useHistory } from "react-router-dom";
import { useApiRequest } from "@/hook/useApiRequest";

const autoLoginNotificationKey = "autoLogin";

/**
 * 查询是否已登录.
 * 若已登录，自动跳转到主页.
 * */
function AutoLogin() {
  const history = useHistory();
  useApiRequest({
    path: "/whoami",
    onLoad: () => {
      notification.info({
        key: autoLoginNotificationKey,
        message: "检查登录状态中...",
        icon: <Spin />,
        duration: 0,
      });
    },
    onSuccess: () => {
      setTimeout(() => {
        notification.success({
          key: autoLoginNotificationKey,
          message: "已登录, 自动跳转到主页.",
          duration: 3,
        });
      }, 500);
      history.push(routePath.wcms.DASHBOARD);
    },
    onUnsuccessful: () => {
      setTimeout(() => {
        notification.close(autoLoginNotificationKey);
      }, 500);
    },
  });
  return null;
}

export { AutoLogin };
