import React from "react";
import { Button, Checkbox, Divider, Form, Icon, Input, Modal } from "antd";
import { config } from "CONFIG";
import { useApi, useTitleWCMS, useLocalStorage } from "HOOK";
import { AutoLogin } from "./AutoLogin";
import { routePath } from "PAGE/routePath";
import { Redirect } from "react-router-dom";
import "./style.css";

function LoginForm(props) {
  useTitleWCMS("登录");

  const [isRememberAccount, setIsRememberAccount] = useLocalStorage(
    "isRememberAccount"
  );
  const [
    rememberedAccount,
    setRememberedAccount,
    removeRememberedAccount,
  ] = useLocalStorage("rememberedAccount");

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
  });

  if (isSuccess) {
    return <Redirect push to={routePath.wcms.DASHBOARD} />;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const { validateFields } = props.form;
    validateFields((err, values) => {
      if (!err) {
        setIsRememberAccount(values.rememberAccount);
        if (values.rememberAccount) {
          setRememberedAccount(values.username);
        } else {
          removeRememberedAccount();
        }
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
            initialValue: rememberedAccount ? rememberedAccount : "",
            rules: [{ required: true, message: "请输入登录账号" }],
          })(
            <Input
              prefix={<Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />}
              placeholder="账号"
            />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator("password", {
            rules: [{ required: true, message: "请输入密码" }],
          })(
            <Input.Password
              prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />}
              placeholder="密码"
            />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator("rememberAccount", {
            valuePropName: "checked",
            initialValue: isRememberAccount === true,
          })(<Checkbox>记住账号</Checkbox>)}
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
