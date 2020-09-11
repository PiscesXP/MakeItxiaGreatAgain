import React from "react";
import { Modal } from "antd";
import { ChangeRole } from "./ChangeRole";
import { ChangeDisable } from "./ChangeDisable";
import { ResetPassword } from "./ResetPassword";

function MemberActionModal({
  actionType,
  member,
  visible,
  onHide,
  onRefreshData,
}) {
  if (!!!member) {
    return null;
  }

  return (
    <>
      <Modal
        title={`重置 ${member.realName} 的密码`}
        centered={true}
        visible={visible && actionType === "passwordReset"}
        footer={null}
        onCancel={onHide}
        destroyOnClose
      >
        <ResetPassword member={member} />
      </Modal>
      {visible && actionType === "changeDisable" && (
        <ChangeDisable
          member={member}
          onRefreshData={onRefreshData}
          onHide={onHide}
        />
      )}
      <Modal
        title={`更改 ${member.realName} 的账号权限`}
        centered={true}
        visible={visible && actionType === "changeRole"}
        footer={null}
        onCancel={onHide}
        destroyOnClose
      >
        <ChangeRole
          member={member}
          onHide={onHide}
          onRefreshData={onRefreshData}
        />
      </Modal>
    </>
  );
}

export { MemberActionModal };
