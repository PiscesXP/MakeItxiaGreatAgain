import React from "react";
import { Button, Card, Divider, Form, Input } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import "./loginPage.css";
import { config } from "CONFIG";
import { useApiRequest } from "@/hook/useApiRequest";
import { useHistory } from "react-router-dom";
import { routePath } from "@/page/routePath";
import { useTitleWCMS } from "@/hook/useTitle";
import { AutoLogin } from "./AutoLogin";

interface LoginFormFields {
  loginName: string;
  password: string;
}

/**
 * 登录表单.
 * */
function LoginForm() {
  const history = useHistory();

  //优雅的API调用
  const { loading, sendRequest } = useApiRequest({
    path: "/login",
    method: "POST",
    manual: true,
    popModal: {
      onFail: true,
      onError: true,
    },
    onSuccess: () => {
      //登录成功, 跳转到主页
      history.push(routePath.wcms.DASHBOARD);
    },
  });

  async function handleLogin(values: LoginFormFields) {
    sendRequest({ requestBody: values });
  }

  return (
    <Form onFinish={handleLogin}>
      <div className="login-title">
        <h3>IT侠后台管理系统</h3>
      </div>
      <img
        src="/img/itxia-logo.png"
        alt="itxia logo"
        className="login-itxia-logo itxia-logo"
      />

      <Form.Item
        name="loginName"
        rules={[
          {
            required: true,
            message: "请输入账号",
          },
        ]}
      >
        <Input
          prefix={<UserOutlined className="form-field-icon" />}
          placeholder="账号"
        />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[
          {
            required: true,
            message: "请输入密码",
          },
          {
            pattern: /^.{8,}$/,
            message: "请输入密码",
          },
        ]}
      >
        <Input.Password
          prefix={<LockOutlined className="form-field-icon" />}
          placeholder="密码"
        />
      </Form.Item>

      <Form.Item>
        <Button
          loading={loading}
          type="primary"
          htmlType="submit"
          className="login-form-button"
        >
          登录
        </Button>
      </Form.Item>
      <Divider />
      <p>其它登录方式:</p>
      <div className="login-by">
        {/*use target="_blank" to open in new tab*/}
        <a href={config.oauth.qq} target="_self" rel="noopener noreferrer">
          <img
            src="/img/loginViaQQ.png"
            alt="QQ授权登录"
            className="qq-oauth-logo"
          />
        </a>
      </div>
    </Form>
  );
}

function LoginPage() {
  useTitleWCMS("登录");
  return (
    <div className="login-container">
      <Card className="login-card">
        <AutoLogin />
        <LoginForm />
      </Card>
    </div>
  );
}

export { LoginPage };
