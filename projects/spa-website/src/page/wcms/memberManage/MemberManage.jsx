import React, { useState } from "react";
import { useApi, useMemberContext } from "HOOK";
import { MemberInfoTable } from "PAGE/wcms/memberManage/MemberInfoTable";
import { MemberActionButtons } from "PAGE/wcms/memberManage/MemberActionButtons";
import "./index.css";
import { Modal } from "antd";

function MemberManage() {
  const memberContext = useMemberContext();

  const { code, payload } = useApi({ path: "/member/all" });

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

  if (memberContext.role === "MEMBER") {
    Modal.info({
      content: "只有管理员才能使用此功能.",
      centered: true,
    });
    return null;
  }

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
    <div>
      <MemberActionButtons
        selectedMember={selectedMember}
        onDisableAccount={handleDisableAccount}
      />
      <MemberInfoTable data={payload} onSelectRow={handleSelect} />
    </div>
  );
}

export { MemberManage };
