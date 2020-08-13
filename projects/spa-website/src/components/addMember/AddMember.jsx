import {
  Alert,
  Button,
  Form,
  Icon,
  Input,
  notification,
  Radio,
  Result
} from "antd";
import React from "react";
import * as api from "UTIL/api";

class AddMemberForm extends React.Component {
  state = {
    submit: {
      loading: false,
      payload: undefined,
      error: undefined
    }
  };

  componentDidMount() {
    const savedFormValues = localStorage.getItem("addMember");
    if (savedFormValues) {
      try {
        this.props.form.setFieldsValue(JSON.parse(savedFormValues));
      } catch (e) {
        console.log("cannot set fields from local storage.");
        localStorage.removeItem("addMember");
      }
    }
  }

  componentWillUnmount() {
    const values = this.props.form.getFieldsValue();
    localStorage.setItem("addMember", JSON.stringify(values));
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err) {
        //表单验证未通过
        return;
      }
      //提交表单
      this.setState({
        submit: {
          loading: true
        }
      });
      api
        .POST("/user", values)
        .then(payload => {
          this.setState({
            submit: {
              loading: false,
              payload
            }
          });
          localStorage.removeItem("addMember");
          this.props.form.setFieldsValue({});
        })
        .catch("error", e => {
          notification.error({
            message: "网络请求失败",
            description: e.toString(),
            duration: 0
          });
          this.setState({
            submit: {
              loading: false,
              error: e
            }
          });
        });
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 }
    };
    const { payload } = this.state.submit;
    if (payload) {
      return (
        <Result
          status="success"
          title="添加成功"
          subTitle={`成功添加新成员:${payload.realName}, ID:${payload._id}`}
          extra={[
            <Button
              type="primary"
              onClick={() => {
                this.setState({
                  submit: {
                    loading: false,
                    payload: undefined,
                    error: undefined
                  }
                });
              }}
            >
              返回
            </Button>
          ]}
        />
      );
    }

    return (
      <Form {...formItemLayout} onSubmit={this.handleSubmit}>
        <Form.Item label="姓名">
          {getFieldDecorator("realName", {
            rules: [
              { required: true, message: "请填写姓名" },
              {
                pattern: /^.{2,16}$/,
                message: "2-16个字符"
              }
            ]
          })(
            <Input
              prefix={<Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />}
              type="text"
              placeholder="姓名"
            />
          )}
        </Form.Item>
        <Form.Item label="登录账号名">
          {getFieldDecorator("loginName", {
            rules: [
              { required: true, message: "请填写登录账号名" },
              {
                pattern: /^\w{4,16}$/,
                message: "账号格式不正确"
              }
            ]
          })(
            <Input
              prefix={
                <Icon type="user-add" style={{ color: "rgba(0,0,0,.25)" }} />
              }
              type="text"
              placeholder="登录账号名"
              autoComplete="new-password"
            />
          )}
          <Alert
            message="用于登录系统，4-16位字母、数字组合。"
            type="info"
            closable
          />
        </Form.Item>
        <Form.Item label="密码">
          {getFieldDecorator("password", {
            rules: [
              { required: true, message: "请填写密码" },
              {
                pattern: /^\w{8,16}$/,
                message: "密码格式不正确"
              }
            ]
          })(
            <Input.Password
              prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />}
              placeholder="密码"
            />
          )}
          <Alert
            message="密码格式：8-16位字母、数字组合"
            type="info"
            closable
          />
        </Form.Item>
        <Form.Item label="确认密码">
          {getFieldDecorator("confirmPassword", {
            rules: [
              (rules, value, callback) => {
                if (this.props.form.getFieldsValue().password === value) {
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
        <Form.Item label="校区">
          {getFieldDecorator("campus", {
            rules: [{ required: true, message: "请选择你的校区" }],
            initialValue: "仙林"
          })(
            <Radio.Group>
              <Radio value={"仙林"}>仙林</Radio>
              <Radio value={"鼓楼"}>鼓楼</Radio>
            </Radio.Group>
          )}
        </Form.Item>
        <Form.Item label="身份">
          {getFieldDecorator("role", {
            rules: [{ required: true, message: "请选择成员身份" }],
            initialValue: "普通成员"
          })(
            <Radio.Group>
              <Radio value={"普通成员"}>普通成员</Radio>
              <Radio value={"管理员"}>管理员</Radio>
            </Radio.Group>
          )}
        </Form.Item>
        <Form.Item wrapperCol={{ span: 12, offset: 9 }}>
          <Button
            type="primary"
            loading={this.state.submit.loading}
            htmlType="submit"
          >
            添加成员
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

const AddMember = Form.create()(AddMemberForm);

export { AddMember };
