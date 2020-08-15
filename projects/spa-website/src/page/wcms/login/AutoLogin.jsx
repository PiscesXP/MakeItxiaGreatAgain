import React from "react";
import { useApi } from "HOOK";
import { notification, Spin } from "antd";
import { routePath } from "PAGE/routePath";
import { Redirect } from "react-router-dom";

const autoLoginNotificationKey = "autoLogin";
/**
 * 查询是否已登录.
 * 若已登录，自动跳转到主页.
 * */
function AutoLogin() {
  const { isSuccess } = useApi({
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
    },
    onUnsuccessful: () => {
      setTimeout(() => {
        notification.close(autoLoginNotificationKey);
      }, 500);
    },
  });

  if (isSuccess) {
    //跳转到主页
    return <Redirect to={routePath.wcms.DASHBOARD} />;
  }

  return null;
}

export { AutoLogin };
