import React from "react";
import { Button, Form, Input } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";

function LoginPage() {
  function handleLogin() {}

  return (
    <Form onFinish={handleLogin}>
      <Form.Item name="loginName" rules={[{ required: true }]}>
        <Input prefix={<UserOutlined />} placeholder="账号" />
      </Form.Item>
      <Form.Item>
        <Input.Password prefix={<LockOutlined />} placeholder="密码" />
      </Form.Item>
      <Form.Item>
        <Button htmlType="submit">登录</Button>
      </Form.Item>
    </Form>
  );
}

export { LoginPage };
