import React from "react";
import { LockOutlined } from "@ant-design/icons";
import { Form } from "@ant-design/compatible";
import "@ant-design/compatible/assets/index.css";
import { Alert, Button, Col, Input, Modal, Row } from "antd";
import { useApi } from "HOOK";

function PasswordResetForm({
  form: { getFieldDecorator, validateFields, getFieldsValue, resetFields },
}) {
  const { loading, send } = useApi({
    path: "/member/me/password",
    method: "PUT",
    later: true,
    onSuccess: () => {
      Modal.success({
        content: "密码修改成功",
        centered: true,
      });
      resetFields();
    },
    onFail: ({ message }) => {
      Modal.error({
        title: "密码修改失败",
        content: message,
        centered: true,
      });
    },
  });

  function handleSubmit(e) {
    e.preventDefault();
    validateFields(async (err, values) => {
      if (err) {
        return;
      }
      send({
        newPassword: values.password,
      });
    });
  }

  return (
    <Form
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 12 }}
      onSubmit={handleSubmit}
    >
      <Form.Item label="密码">
        {getFieldDecorator("password", {
          rules: [
            { required: true, message: "请填写密码" },
            {
              pattern: /^\S{8,}$/,
              message: " ",
            },
          ],
        })(
          <Input.Password
            prefix={<LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
            placeholder="密码"
            autoComplete="new-password"
          />
        )}
        <Alert message="密码要求：至少8个字符" type="info" />
      </Form.Item>
      <Form.Item label="确认密码">
        {getFieldDecorator("confirmPassword", {
          rules: [
            { required: true },
            (rules, value, callback) => {
              if (getFieldsValue().password === value) {
                callback();
              }
              callback("两次密码不一致");
            },
          ],
        })(
          <Input.Password
            prefix={<LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
            placeholder="确认密码"
            autoComplete="new-password"
          />
        )}
      </Form.Item>

      <Form.Item wrapperCol={{ span: 24 }}>
        <Row type="flex" justify="center" align="middle">
          <Col>
            <Button type="primary" loading={loading} htmlType="submit">
              重置密码
            </Button>
          </Col>
        </Row>
      </Form.Item>
    </Form>
  );
}

const PasswordReset = Form.create()(PasswordResetForm);

export { PasswordReset };
