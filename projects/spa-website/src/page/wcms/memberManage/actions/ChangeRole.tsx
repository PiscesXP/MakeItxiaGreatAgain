import React, { useMemo } from "react";
import { Button, Form, Select } from "antd";
import { useMemberContext } from "@/hook/useMemberContext";
import { authTest } from "@/util/authTest";
import { CenterMeFlex } from "@/components/layout";
import { useApiRequest } from "@/hook/useApiRequest";

interface ChangeRoleProps {
  member: any;
  onHide: () => void;
  onRefreshData: () => void;
}

/**
 * 更改账号权限的表单.
 * */
export const ChangeRole: React.FC<ChangeRoleProps> = ({
  member,
  onHide,
  onRefreshData,
}) => {
  const memberContext = useMemberContext();

  const amISuperAdmin = useMemo(() => memberContext.role === "SUPER_ADMIN", [
    memberContext.role,
  ]);

  const canIChangeIt = useMemo(() => {
    return authTest.notLessThan(memberContext.role, member.role);
  }, [memberContext.role, member]);

  const { loading, sendRequest } = useApiRequest({
    path: `/member/${member._id}/role`,
    method: "PUT",
    manual: true,
    popModal: {
      onSuccess: {
        title: "权限修改成功",
        onOk: () => {
          onHide();
        },
      },
      onFail: true,
      onError: true,
    },
    onSuccess: () => {
      onRefreshData();
    },
    onFail: () => {
      onRefreshData();
    },
  });

  function handleSubmit(values: any) {
    sendRequest({ requestBody: values });
  }

  return (
    <Form onFinish={handleSubmit}>
      <Form.Item
        name="role"
        label="账号身份"
        rules={[{ required: true, message: "请选择账号权限" }]}
        initialValue={member.role}
        hasFeedback
      >
        <Select placeholder="请选择账号权限" disabled={!canIChangeIt}>
          <Select.Option value={"MEMBER"}>普通成员</Select.Option>
          <Select.Option value={"ADMIN"}>管理员</Select.Option>
          <Select.Option value={"SUPER_ADMIN"} disabled={!amISuperAdmin}>
            超级管理员
          </Select.Option>
        </Select>
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
};
