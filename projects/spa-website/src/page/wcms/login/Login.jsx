import React from "react";
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, Divider, Input, Modal } from "antd";
import { config } from "CONFIG";
import { useApi, useTitleWCMS } from "HOOK";
import { AutoLogin } from "./AutoLogin";
import { routePath } from "PAGE/routePath";
import { Redirect } from "react-router-dom";
import "./style.css";
import { GET } from "@/request/api";

function LoginForm(props) {
  useTitleWCMS("登录");

  const { loading, isSuccess, send } = useApi({
    path: "/login",
    method: "POST",
    later: true,
    onFail: ({ message }) => {
      Modal.error({
        title: "登录失败",
        content: message,
        centered: true,
      });
    },
    onSuccess: async () => {
      const { code } = await GET("/whoami");
      if (code !== 0) {
        Modal.error({
          title: "无法保存登录状态",
          content: (
            <div>
              <p>
                如果你在用iPad/iPhone:请在Safari设置中关闭"阻止所有cookie"和"阻止跨网站跟踪"
              </p>
              <p>其它浏览器:请启用cookie</p>
            </div>
          ),
          centered: true,
        });
      }
    },
  });

  if (isSuccess) {
    return <Redirect push to={routePath.wcms.DASHBOARD} />;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const { validateFields } = props.form;
    validateFields((err, values) => {
      if (!err) {
        const { loginName, password } = values;
        send({ loginName, password });
      }
    });
  }

  const { getFieldDecorator } = props.form;
  const oAuthUrl = config.oauth.qq;
  return (
    <div className="loginPage">
      <AutoLogin />
      <Form onSubmit={handleSubmit} className="login-form">
        <div id="loginSystemName">
          <h3>IT侠后台管理系统</h3>
          <Divider dashed />
        </div>
        <img src="/img/itxia-logo.jpg" alt="itxia logo" id="itxia-logo" />
        <Form.Item>
          {getFieldDecorator("loginName", {
            initialValue: "",
            rules: [{ required: true, message: "请输入登录账号" }],
          })(
            <Input
              prefix={<UserOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
              placeholder="账号"
            />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator("password", {
            rules: [{ required: true, message: "请输入密码" }],
          })(
            <Input.Password
              prefix={<LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
              placeholder="密码"
            />
          )}
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
            loading={loading}
          >
            登录
          </Button>
        </Form.Item>
        <Divider />
        <p>其它登录方式:</p>
        <div id="other-login">
          <a href={oAuthUrl} target="_blank" rel="noopener noreferrer">
            <img
              src="/img/loginViaQQ.png"
              alt="QQ授权登录"
              id="qq-oauth-logo"
            />
          </a>
        </div>
      </Form>
    </div>
  );
}

const Login = Form.create()(LoginForm);

export { Login };
