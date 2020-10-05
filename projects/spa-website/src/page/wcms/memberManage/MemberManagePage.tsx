import React, { useEffect } from "react";
import { MemberInfoTable } from "./MemberInfoTable";
import { Card, Divider, Modal } from "antd";
import { MemberRecruit } from "./MemberRecruit";
import { useTitleWCMS } from "@/hook/useTitle";
import { useMemberContext } from "@/hook/useMemberContext";
import { useApiRequest } from "@/hook/useApiRequest";
import { MemberRoleEnum } from "@/util/enum";
import "./index.css";
import { usePersistFn } from "@/hook/usePersisFn";

export const MemberManage: React.FC = () => {
  useTitleWCMS("成员管理");

  const memberContext = useMemberContext();

  const { code, payload, sendRequest } = useApiRequest({
    path: "/member/all",
    formatResult: (result) => {
      if (Array.isArray(result)) {
        return result.reverse();
      }
      return result;
    },
  });

  useEffect(() => {
    if (memberContext.role === MemberRoleEnum.MEMBER) {
      Modal.info({
        content: "只有管理员才能使用此功能.",
        centered: true,
      });
    }
  }, [memberContext.role]);

  const handleRefreshData = usePersistFn(() => {
    sendRequest();
  });

  if (code !== 0) {
    return null;
  }

  return (
    <>
      <Card title="系统成员">
        <MemberInfoTable data={payload} onRefreshData={handleRefreshData} />
      </Card>
      <Divider dashed />
      <Card title="我的邀请">
        <MemberRecruit />
      </Card>
    </>
  );
};
