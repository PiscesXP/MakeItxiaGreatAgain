import React, { useMemo } from "react";
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, Modal, Select } from "antd";
import { useMemberContext } from "HOOK/useMemberContext";
import { authTest } from "UTIL/authTest";
import { useApi } from "HOOK/useApi";
import { CenterMeFlex } from "COMPONENTS/layout";

/**
 * 更改账号权限的表单.
 * */
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
    return authTest.notLessThan(memberContext.role, member.role);
  }, [memberContext.role, member]);

  const { loading, send } = useApi({
    path: `/member/${member._id}/role`,
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
          initialValue: member.role,
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

const ChangeRole = Form.create()(ChangeRoleForm);

export { ChangeRole };
