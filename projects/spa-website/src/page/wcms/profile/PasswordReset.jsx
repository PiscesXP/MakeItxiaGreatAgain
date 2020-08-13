import React from "react";
import { Alert, Button, Col, Form, Icon, Input, Modal, Row } from "antd";
import { useApi } from "HOOK";

function PasswordResetForm({
  form: { getFieldDecorator, validateFields, getFieldsValue, resetFields }
}) {
  const { loading, send, emitter } = useApi({
    path: "/member/me/password",
    method: "PUT",
    later: true
  });
  emitter.onSuccess(() => {
    Modal.success({
      content: "密码修改成功",
      centered: true
    });
    resetFields();
  });
  emitter.onFail(({ message }) => {
    Modal.error({
      title: "密码修改失败",
      content: message,
      centered: true
    });
  });

  function handleSubmit(e) {
    e.preventDefault();
    validateFields(async (err, values) => {
      if (err) {
        return;
      }
      send({
        newPassword: values.password
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
              message: " "
            }
          ]
        })(
          <Input.Password
            prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />}
            placeholder="密码"
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
            }
          ]
        })(
          <Input.Password
            prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />}
            placeholder="确认密码"
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
