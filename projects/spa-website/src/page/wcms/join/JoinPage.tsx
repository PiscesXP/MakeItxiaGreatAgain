import React, { useMemo } from "react";
import { LockOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, Modal } from "antd";
import { CenterMeFlex } from "@/components/layout";
import { parseQueryString } from "@/util/query";
import { useHistory } from "react-router-dom";
import { routePath } from "@/page/routePath";
import "./join.css";
import { useTitle } from "@/hook/useTitle";
import { CampusFormItem } from "@/components/form/CampusFormItem";
import { useApiRequest } from "@/hook/useApiRequest";

export const JoinPage: React.FC = () => {
  useTitle("欢迎加入IT侠");

  const history = useHistory();

  const [form] = Form.useForm();

  const { loading, sendRequest } = useApiRequest({
    path: "/member/recruit/register",
    method: "POST",
    manual: true,
    popModal: {
      onSuccess: {
        title: "提交成功",
        content: (
          <div>
            <p>欢迎加入IT侠~</p>
            <p>待管理员确认后，即可登录系统.</p>
          </div>
        ),
        okText: "返回主页",
        onOk: () => {
          history.push(routePath.CUSTOM);
        },
      },
      onError: true,
    },
    onSuccess: () => {
      form.resetFields();
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

  function handleSubmit(values: any) {
    sendRequest({ requestBody: values });
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
          form={form}
          onFinish={handleSubmit}
        >
          <Form.Item
            name="redeemCode"
            label="邀请码"
            initialValue={initRedeemCode}
            rules={[{ required: true, message: "请输入邀请码" }]}
            hasFeedback
          >
            <Input placeholder="一般无需你自行填写，请找管理员要" />
          </Form.Item>

          <Form.Item
            name="realName"
            label="姓名"
            rules={[{ required: true, message: "请输入姓名" }]}
            hasFeedback
          >
            <Input placeholder="你的名字" />
          </Form.Item>

          <Form.Item
            name="loginName"
            label="账号名"
            rules={[{ required: true, message: "请输入登录账号名" }]}
            hasFeedback
          >
            <Input placeholder="用于登录系统" />
          </Form.Item>

          <Form.Item
            name="password"
            label="密码"
            rules={[
              { required: true, message: "请填写密码" },
              {
                pattern: /^\S{8,}$/,
                message: "至少8个字符",
              },
            ]}
            hasFeedback
          >
            <Input.Password
              prefix={<LockOutlined className="form-field-icon" />}
              placeholder="密码"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="确认密码"
            rules={[
              { required: true, message: "请填写密码" },
              {
                validator: async (rule, value) => {
                  if (form.getFieldValue("password") !== value) {
                    return Promise.reject("两次输入密码不一致");
                  }
                },
              },
            ]}
            hasFeedback
          >
            <Input.Password
              prefix={<LockOutlined className="form-field-icon" />}
              placeholder="请再次输入密码"
            />
          </Form.Item>

          <CampusFormItem />

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
};
