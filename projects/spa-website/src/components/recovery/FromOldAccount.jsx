import React, { useState } from "react";
import { LockOutlined, UserAddOutlined } from "@ant-design/icons";
import { Form } from "@ant-design/compatible";
import "@ant-design/compatible/assets/index.css";
import { Alert, Button, Input, Modal } from "antd";
import * as api from "@/request/api";

function FromOldAccountForm(props) {
  const [loading, setLoading] = useState(false);
  function handleSubmit(e) {
    e.preventDefault();
    props.form.validateFields(async (error, values) => {
      //TODO
      if (error) {
        return;
      }
      try {
        await api.POST("/recovery/legacyAccount", values);
        setLoading(true);
        Modal.success({
          title: "恢复成功",
          content: "现在可以用新账号登录系统",
          onOk: () => {
            window.location = "/login";
          },
          centered: true,
        });
      } catch (error) {
        Modal.error({
          title: "恢复失败",
          content: error.message,
          centered: true,
        });
      }
    });
  }

  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 15 },
  };
  const { getFieldDecorator } = props.form;
  return (
    <Form {...formItemLayout} onSubmit={handleSubmit}>
      <h3>旧账号信息</h3>
      <Form.Item label="旧账号名">
        {getFieldDecorator("oldAccount", {
          rules: [{ required: true, message: "请填写旧系统账号名" }],
        })(<Input type="text" placeholder="旧系统账号名" />)}
      </Form.Item>
      <Form.Item label="旧密码">
        {getFieldDecorator("oldPassword", {
          rules: [{ required: true, message: "请填写旧系统密码" }],
        })(<Input type="password" placeholder="旧系统密码" />)}
      </Form.Item>
      <h3>新账号信息</h3>
      <Form.Item label="新账号名">
        {getFieldDecorator("loginName", {
          rules: [
            { message: "请填写新账号名" },
            {
              pattern: /^\w{4,16}$/,
              message: "账号格式不正确",
            },
          ],
        })(
          <Input
            prefix={<UserAddOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
            type="text"
            placeholder="新账号名"
            autoComplete="new-password"
          />
        )}
        <Alert
          message="(不填则沿用旧账号名) 用于登录系统，4-16位字母、数字组合."
          type="info"
        />
      </Form.Item>
      <Form.Item label="新密码">
        {getFieldDecorator("password", {
          rules: [
            { required: true, message: "请填写新密码" },
            {
              pattern: /^.{8,256}$/,
              message: "密码格式不正确",
            },
          ],
        })(
          <Input.Password
            prefix={<LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
            placeholder="新密码"
          />
        )}
        <Alert message="密码至少8个字符." type="info" />
      </Form.Item>
      <Form.Item wrapperCol={{ span: 12, offset: 9 }}>
        <Button type="primary" loading={loading} htmlType="submit">
          恢复账号
        </Button>
      </Form.Item>
    </Form>
  );
}

const FromOldAccount = Form.create()(FromOldAccountForm);

export { FromOldAccount };
