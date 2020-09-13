import React, { useMemo } from "react";
import { Alert, Button, Card, Form, Icon, Input, Modal, Select } from "antd";
import "./join.css";
import { CenterMeFlex } from "COMPONENTS/layout";
import { useApi, useTitle } from "HOOK/index";
import { parseQueryString } from "UTIL/query";
import { useHistory } from "react-router-dom";
import { routePath } from "PAGE/routePath";

function JoinForm({
  form: { getFieldDecorator, getFieldsValue, validateFieldsAndScroll },
}) {
  useTitle("欢迎加入IT侠");
  const history = useHistory();

  const { loading, send } = useApi({
    path: "/member/recruit/register",
    method: "POST",
    later: true,
    onSuccess: () => {
      Modal.success({
        title: "提交成功",
        content: (
          <div>
            <p>欢迎加入IT侠~</p>
            <p>待管理员确认后，即可登录系统.</p>
          </div>
        ),
        centered: true,
        okText: "返回主页",
        onOk: () => {
          history.push(routePath.CUSTOM);
        },
      });
    },
    onFail: ({ code }) => {
      let message = "";
      if (code === 14) {
        message = "邀请码无效，请跟管理员确认后再试.";
      } else if (code === 15) {
        message = "登录账号名已存在，请换个试试.";
      }
      Modal.error({
        title: "提交失败",
        content: message,
        centered: true,
      });
    },
  });

  function handleSubmit(e) {
    e.preventDefault();
    validateFieldsAndScroll((error, values) => {
      if (error) {
        return;
      }
      send(values);
    });
  }

  const initRedeemCode = useMemo(() => {
    const { redeemCode } = parseQueryString();
    if (typeof redeemCode === "string") {
      return redeemCode;
    }
    return "";
  }, []);

  return (
    <div className="join-page-container">
      <Card title="加入IT侠" className="join-page-card">
        <Form
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 12 }}
          onSubmit={handleSubmit}
        >
          <Form.Item label="邀请码" hasFeedback>
            {getFieldDecorator("redeemCode", {
              initialValue: initRedeemCode,
              rules: [{ required: true, message: "请输入邀请码" }],
            })(<Input placeholder="一般无需你自行填写，请找管理员要" />)}
          </Form.Item>

          <Form.Item label="姓名" hasFeedback>
            {getFieldDecorator("realName", {
              rules: [{ required: true, message: "请输入姓名" }],
            })(<Input placeholder="你的名字" />)}
          </Form.Item>

          <Form.Item label="账号名" hasFeedback>
            {getFieldDecorator("loginName", {
              rules: [{ required: true, message: "请输入登录账号名" }],
            })(<Input placeholder="用于登录系统" />)}
          </Form.Item>

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
                prefix={
                  <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                placeholder="密码"
              />
            )}
            <Alert message="密码要求：至少8个字符" type="info" />
          </Form.Item>

          <Form.Item label="确认密码">
            {getFieldDecorator("confirmPassword", {
              rules: [
                { required: true, message: "请填写密码" },
                (rules, value, callback) => {
                  if (getFieldsValue().password === value) {
                    callback();
                  }
                  callback("两次密码不一致");
                },
              ],
            })(
              <Input.Password
                prefix={
                  <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                placeholder="请再次输入密码"
              />
            )}
          </Form.Item>

          <Form.Item label="校区" hasFeedback>
            {getFieldDecorator("campus", {
              rules: [{ required: true, message: "请选择你的校区" }],
            })(
              <Select placeholder="请选择你的校区">
                <Select.Option value={"XIANLIN"}>仙林</Select.Option>
                <Select.Option value={"GULOU"}>鼓楼</Select.Option>
              </Select>
            )}
          </Form.Item>

          <Form.Item wrapperCol={{ span: 24 }}>
            <CenterMeFlex>
              <Button type="primary" loading={loading} htmlType="submit">
                提交申请
              </Button>
            </CenterMeFlex>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

const Join = Form.create()(JoinForm);

export { Join };
