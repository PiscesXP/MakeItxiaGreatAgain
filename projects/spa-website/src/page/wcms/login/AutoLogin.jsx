import React from "react";
import { useApi } from "HOOK";
import { notification, Spin } from "antd";
import { routePath } from "PAGE/routePath";
import { useHistory } from "react-router-dom";

const autoLoginNotificationKey = "autoLogin";

/**
 * 查询是否已登录.
 * 若已登录，自动跳转到主页.
 * */
function AutoLogin() {
  const { emitter } = useApi({ path: "/whoami" });
  const history = useHistory();

  emitter.onLoading(() => {
    notification.info({
      key: autoLoginNotificationKey,
      message: "检查登录状态中...",
      icon: <Spin />,
      duration: 0
    });
  });

  emitter.onSuccess(() => {
    setTimeout(() => {
      notification.success({
        key: autoLoginNotificationKey,
        message: "已登录, 自动跳转到主页.",
        duration: 3
      });
    }, 500);
    //跳转到主页
    history.push(routePath.wcms.DASHBOARD);
  });

  emitter.onFailOrError(() => {
    setTimeout(() => {
      notification.close(autoLoginNotificationKey);
    }, 500);
  });

  return null;
}

export { AutoLogin };
