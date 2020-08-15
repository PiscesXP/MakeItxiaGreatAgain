import React from "react";
import { Button } from "antd";
import { Redirect } from "react-router-dom";
import { routePath } from "PAGE/routePath";
import { useApi } from "HOOK";

function LogoutButton() {
  const { isSuccess, send } = useApi({
    path: "/logout",
    later: true,
  });

  if (isSuccess) {
    return <Redirect push to={routePath.WCMS} />;
  }

  function handleLogout() {
    send();
  }

  return (
    <Button type="danger" onClick={handleLogout} id="logout-btn">
      退出登录
    </Button>
  );
}

export { LogoutButton };
