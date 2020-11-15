import React from "react";
import { Button } from "antd";
import { useHistory } from "react-router-dom";
import { routePath } from "@/page/routePath";
import { useApiRequest } from "@/hook/useApiRequest";

export const LogoutButton: React.FC = () => {
  const history = useHistory();

  const { code, sendRequest } = useApiRequest({
    path: "/logout",
    manual: true,
  });

  if (code === 0) {
    setTimeout(() => {
      history.replace(routePath.wcms.LOGIN);
    }, 0);
    return null;
  }

  function handleLogout() {
    sendRequest();
  }

  return (
    <Button type="primary" danger onClick={handleLogout} id="logout-btn">
      退出登录
    </Button>
  );
};
