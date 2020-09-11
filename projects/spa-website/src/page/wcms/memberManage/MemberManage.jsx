import React, { useCallback, useEffect } from "react";
import { useApi, useMemberContext, useTitleWCMS } from "HOOK";
import { MemberInfoTable } from "./MemberInfoTable";
import "./index.css";
import { Card, Divider, Modal } from "antd";
import { MemberRecruit } from "./MemberRecruit";

function MemberManage() {
  useTitleWCMS("成员管理");

  const memberContext = useMemberContext();

  const { code, payload, send } = useApi({
    path: "/member/all",
    formatResult: (result) => {
      if (Array.isArray(result)) {
        return result.reverse();
      }
      return result;
    },
  });

  useEffect(() => {
    if (memberContext.role === "MEMBER") {
      Modal.info({
        content: "只有管理员才能使用此功能.",
        centered: true,
      });
    }
  }, [memberContext.role]);

  const handleRefreshData = useCallback(() => {
    send();
  }, [send]);

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
}

export { MemberManage };
