import React from "react";
import { Button } from "antd";
import { useHistory } from "react-router-dom";
import { routePath } from "PAGE/routePath";
import { useApi } from "HOOK";

function LogoutButton() {
  const history = useHistory();

  const { send, emitter } = useApi({ path: "/logout", later: true });

  emitter.onRequestDone(() => {
    history.push(routePath.WCMS);
  });

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
