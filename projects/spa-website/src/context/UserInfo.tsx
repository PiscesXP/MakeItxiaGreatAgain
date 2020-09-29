import React, { useEffect } from "react";
import { Loading } from "@/components/loading";
import { Redirect, useHistory } from "react-router-dom";
import { routePath } from "@/page/routePath";
import { Modal } from "antd";
import { useApiRequest } from "@/hook/useApiRequest";
import { usePersistFn } from "@/hook/usePersisFn";
import { CampusEnum, MemberRoleEnum } from "@/util/enum";

export interface WhoamiData {
  readonly campus: CampusEnum;
  readonly _id: string;
  readonly loginName: string;
  readonly realName: string;
  readonly role: MemberRoleEnum;
  readonly email: string;
  readonly emailNotification: any;
  readonly requirePasswordReset: boolean;
  refresh: () => void;
}

const UserInfoContext = React.createContext<WhoamiData | null>(null);

/**
 * 提供当前登录用户信息的context.
 */
function UserInfoProvider(props: any) {
  const { loading, code, payload, error, sendRequest } = useApiRequest({
    path: "/whoami",
  });

  const history = useHistory();

  const refresh = usePersistFn(sendRequest);

  useEffect(() => {
    if (payload && (payload as WhoamiData).requirePasswordReset) {
      Modal.warning({
        title: "请尽快修改密码",
        content: "密码已过期，请尽快修改.",
        centered: true,
        okText: "马上去修改",
        onOk: () => {
          history.push(routePath.wcms.SELF_PROFILE);
        },
        cancelText: "以后再说",
        okCancel: true,
      });
    }
  }, [history, payload]);

  if (loading && code !== 0) {
    return <Loading />;
  }

  //未登录，跳转到登录页
  if (error || code !== 0) {
    return <Redirect to={routePath.wcms.LOGIN} />;
  }

  return (
    <UserInfoContext.Provider value={{ refresh, ...payload }}>
      {props.children}
    </UserInfoContext.Provider>
  );
}

export { UserInfoContext, UserInfoProvider };
