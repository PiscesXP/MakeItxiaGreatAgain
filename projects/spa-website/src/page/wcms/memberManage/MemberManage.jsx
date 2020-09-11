import React, { useCallback, useEffect, useState } from "react";
import { useApi, useMemberContext, useTitleWCMS } from "HOOK";
import { MemberInfoTable } from "./MemberInfoTable";
import { MemberActionButtons } from "./MemberActionButtons";
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

  const disableApi = useApi({
    path: "/member/disable",
    method: "POST",
    later: true,
    onSuccess: () => {
      Modal.success({
        content: "操作成功",
        centered: true,
      });
    },
    onFail: ({ message }) => {
      Modal.error({
        title: "操作失败",
        content: message,
        centered: true,
      });
    },
    onError: (error) => {
      Modal.error({
        title: "操作失败",
        content: error.toString(),
        centered: true,
      });
    },
  });

  const [selectedMember, setSelectedMember] = useState([]);

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

  function handleSelect(record, selected, selectedRows) {
    setSelectedMember(selectedRows);
  }

  async function handleDisableAccount() {
    //检查权限
    if (memberContext.role === "ADMIN") {
      const hasSuperAdmin = !selectedMember.every((member) => {
        return member.role !== "SUPER_ADMIN";
      });
      if (hasSuperAdmin) {
        Modal.error({
          title: "权限不足",
          content: "不能更改超级管理员的账号",
          centered: true,
        });
        return Promise.reject();
      }
    }

    disableApi.send(selectedMember.map((member) => member._id));
  }

  return (
    <>
      <Card title="系统成员">
        <MemberActionButtons
          selectedMember={selectedMember}
          onDisableAccount={handleDisableAccount}
        />
        <MemberInfoTable
          data={payload}
          onSelectRow={handleSelect}
          onRefreshData={handleRefreshData}
        />
      </Card>
      <Divider dashed />
      <Card title="我的邀请">
        <MemberRecruit />
      </Card>
    </>
  );
}

export { MemberManage };
