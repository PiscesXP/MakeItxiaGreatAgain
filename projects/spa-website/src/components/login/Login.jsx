import React from "react";
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, Checkbox, Divider, Input, Modal, notification, Spin } from "antd";
import "./style.css";
import * as api from "@/request/api";
import { Redirect } from "react-router-dom";
import { routePath } from "ROUTE/routePath";
import { config } from "CONFIG";

const localStorageKeys = {
  isRememberAccount: "isRememberAccount",
  rememberAccount: "rememberAccount",
};

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLogin: false,
    };
  }

  componentDidMount() {
    this.autoLogin().catch((e) => {});
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        //记住用户名
        localStorage.setItem(
          localStorageKeys.isRememberAccount,
          values.rememberAccount
        );
        if (values.rememberAccount === true) {
          localStorage.setItem(
            localStorageKeys.rememberAccount,
            values.username
          );
        } else {
          localStorage.removeItem(localStorageKeys.rememberAccount);
        }
        //处理登录逻辑
        this.handleLogin(values.username, values.password);
      }
    });
  };

  async handleLogin(username, password) {
    try {
      await api.POST("/login", { loginName: username, password });
      this.setState({ isLogin: true });
    } catch (error) {
      Modal.error({
        title: "登录失败",
        content: error.message,
        centered: true,
      });
    }
  }

  async autoLogin() {
    const key = "autologin";
    notification.info({
      key,
      message: "检查登录状态中...",
      icon: <Spin />,
      duration: 0,
    });
    try {
      await api.GET("/whoami");
      setTimeout(() => {
        notification.success({
          key,
          message: "已登录, 自动跳转到主页.",
          duration: 3,
        });
      }, 500);
      this.setState({
        isLogin: true,
      });
    } catch (error) {
      setTimeout(() => {
        notification.close(key);
      }, 500);
      return Promise.reject(error);
    }
  }

  render() {
    if (this.state.isLogin === true) {
      return <Redirect to={routePath.HOME} />;
    }
    const { getFieldDecorator } = this.props.form;
    const oAuthUrl = config.oauth.qq;
    return (
      <div className="loginPage">
        <Form onSubmit={this.handleSubmit} className="login-form">
          <div id="loginSystemName">
            <h3>IT侠后台管理系统</h3>
            <Divider dashed />
          </div>
          <img src="/img/itxia-logo.jpg" alt="itxia logo" id="itxia-logo"></img>
          <Form.Item>
            {getFieldDecorator("username", {
              initialValue: localStorage.getItem("rememberAccount")
                ? localStorage.getItem("rememberAccount")
                : "",
              rules: [{ required: true, message: "请输入登录账号" }],
            })(
              <Input
                prefix={
                  <UserOutlined style={{ color: "rgba(0,0,0,.25)" }} />
                }
                placeholder="账号"
              />
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator("password", {
              rules: [{ required: true, message: "请输入密码" }],
            })(
              <Input.Password
                prefix={
                  <LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />
                }
                placeholder="密码"
              />
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator("rememberAccount", {
              valuePropName: "checked",
              initialValue:
                localStorage.getItem(localStorageKeys.isRememberAccount) ===
                "true",
            })(<Checkbox>记住账号</Checkbox>)}
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
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
              ></img>
            </a>
          </div>
        </Form>
      </div>
    );
  }
}

const Login = Form.create({ name: "normal_login" })(LoginForm);

export { Login };
