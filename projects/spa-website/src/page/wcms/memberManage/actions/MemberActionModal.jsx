import React from "react";
import { Modal } from "antd";
import { ChangeRole } from "./ChangeRole";
import { ChangeDisable } from "PAGE/wcms/memberManage/actions/ChangeDisable";
import { ResetPassword } from "PAGE/wcms/memberManage/actions/ResetPassword";

function MemberActionModal({ actionType, member, onHide, onRefreshData }) {
  return (
    <>
      <Modal
        title={`更改 ${member && member.realName} 的密码`}
        centered={true}
        visible={actionType === "passwordReset"}
        footer={null}
        onCancel={onHide}
        destroyOnClose
      >
        <ResetPassword member={member} />
      </Modal>
      {actionType === "changeDisable" && (
        <ChangeDisable member={member} onRefreshData={onRefreshData} />
      )}
      <Modal
        title={`更改 ${member && member.realName} 的账号权限`}
        centered={true}
        visible={actionType === "changeRole"}
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
