import React, { useMemo } from "react";
import { Button, Form, Modal, Select } from "antd";
import { useApi, useMemberContext } from "HOOK/index";
import { CenterMeFlex } from "COMPONENTS/layout";
import { authTest } from "UTIL/authTest";

function MemberActionModal({ actionType, member, onHide, onRefreshData }) {
  return (
    <>
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

const ChangeRole = Form.create()(ChangeRoleForm);

function ChangeRoleForm({
  member,
  onHide,
  onRefreshData,
  form: { getFieldDecorator, validateFields },
}) {
  const memberContext = useMemberContext();

  const amISuperAdmin = useMemo(() => memberContext.role === "SUPER_ADMIN", [
    memberContext.role,
  ]);

  const canIChangeIt = useMemo(() => {
    return authTest.notLessThan(memberContext.role, member && member.role);
  }, [memberContext.role, member]);

  const { loading, send } = useApi({
    path: `/member/${member && member._id}/role`,
    method: "PUT",
    later: true,
    onSuccess: () => {
      Modal.success({
        title: "权限修改成功",
        centered: true,
        onOk: () => {
          onHide();
        },
      });
      onRefreshData();
    },
    onFail: () => {
      Modal.warning({
        title: "权限未更改",
        centered: true,
      });
      onRefreshData();
    },
  });

  function handleSubmit(e) {
    e.preventDefault();
    validateFields((error, values) => {
      if (error) {
        return;
      }
      send(values);
    });
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Item label="账号身份" hasFeedback>
        {getFieldDecorator("role", {
          rules: [{ required: true, message: "请选择账号权限" }],
          initialValue: member && member.role,
        })(
          <Select placeholder="请选择账号权限" disabled={!canIChangeIt}>
            <Select.Option value={"MEMBER"}>普通成员</Select.Option>
            <Select.Option value={"ADMIN"}>管理员</Select.Option>
            <Select.Option value={"SUPER_ADMIN"} disabled={!amISuperAdmin}>
              超级管理员
            </Select.Option>
          </Select>
        )}
      </Form.Item>
      <Form.Item wrapperCol={{ span: 24 }}>
        <CenterMeFlex>
          <Button
            type="primary"
            loading={loading}
            disabled={!canIChangeIt}
            htmlType="submit"
          >
            更改权限
          </Button>
        </CenterMeFlex>
      </Form.Item>
    </Form>
  );
}

export { MemberActionModal };
