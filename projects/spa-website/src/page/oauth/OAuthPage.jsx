import React, { useEffect } from "react";
import { parseQueryString } from "UTIL/query";
import { useApi } from "HOOK";
import { useHistory, Redirect } from "react-router-dom";
import { routePath } from "PAGE/routePath";
import { Loading } from "COMPONENTS/loading";
import { Modal, notification } from "antd";

function OAuthPage() {
  const history = useHistory();

  const { code, send } = useApi({
    path: "/oauth/link/qq",
    method: "POST",
    later: true,
    onSuccess: ({ c, message, payload }) => {
      notification.success({
        message: message,
        description: payload.toString(),
        duration: 3,
      });
    },
    onFail: () => {
      Modal.error({
        title: "登录失败",
        content: (
          <div>
            <p>若要通过QQ登录，请先在个人设置绑定QQ账号.</p>
            <p>若要绑定QQ账号，请先确认你是否已登录后台系统.</p>
          </div>
        ),
        centered: true,
        onOk: () => {
          history.push(routePath.wcms);
        },
      });
    },
  });

  useEffect(() => {
    const { token } = parseQueryString();
    send({ accessToken: token });
  }, [send]);

  if (code === 0) {
    return <Redirect to={routePath.wcms.SELF_PROFILE} push />;
  } else {
    return <Loading />;
  }
}
export { OAuthPage };
