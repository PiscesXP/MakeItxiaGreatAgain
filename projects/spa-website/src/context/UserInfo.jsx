import React from "react";
import { Loading } from "COMPONENTS/loading";
import { useHistory, Redirect } from "react-router-dom";
import { routePath } from "PAGE/routePath";
import { Modal } from "antd";
import { useApi } from "HOOK";

const UserInfoContext = React.createContext(null);

/**
 * 提供当前登录用户信息的context.
 */
function UserInfoProvider(props) {
  const { loading, code, payload, error } = useApi({ path: "/whoami" });

  const history = useHistory();

  if (loading) {
    return <Loading />;
  }

  //未登录，跳转到登录页
  if (error || code !== 0) {
    return <Redirect to={routePath.wcms.LOGIN} />;
  }

  if (payload["requirePasswordReset"]) {
    Modal.warning({
      title: "请尽快修改密码",
      content:
        "由于旧系统存储明文密码，存在密码泄露的风险，因此请尽快修改密码.",
      centered: true,
      okText: "马上去修改",
      onOk: () => {
        history.push(routePath.SELF_INFO);
      },
      cancelText: "以后再说",
      okCancel: true,
    });
  }

  return (
    <UserInfoContext.Provider value={payload}>
      {props.children}
    </UserInfoContext.Provider>
  );
}

export { UserInfoContext, UserInfoProvider };
