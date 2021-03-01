import React, { useMemo } from "react";
import { Alert, Button, Checkbox, Col, Form, Input, Row, Select } from "antd";
import { CenterMeFlex } from "@/components/layout";
import { useApiRequest } from "@/hook/useApiRequest";
import { CampusFormItem } from "@/components/form/CampusFormItem";
import { useMemberContext } from "@/hook/useMemberContext";
import { MemberGroupEnum } from "@/util/enum";

export const MemberSettings: React.FC = () => {
  const context = useMemberContext();

  const initialValues = useMemo(() => {
    const result = {
      campus: context.campus,
      email: context.email,
      group: context.group,
      qq: context.qq,
      emailNotification: [] as string[],
    };
    const { emailNotification } = context;
    if (emailNotification) {
      for (const propsKey in emailNotification) {
        if (
          emailNotification.hasOwnProperty(propsKey) &&
          emailNotification[propsKey] === true
        ) {
          result.emailNotification.push(propsKey);
        }
      }
    }
    return result;
  }, [context.campus, context.email, context.group, context.emailNotification]);

  const { loading, sendRequest } = useApiRequest({
    path: "/member/me/profile",
    method: "PUT",
    manual: true,
    popModal: {
      onSuccess: {
        content: "修改成功",
        onOk: () => {
          context.refresh();
        },
      },
      onFail: true,
      onError: true,
    },
  });

  const [form] = Form.useForm();

  function handleSubmit(values: any) {
    sendRequest({ requestBody: values });
  }

  return (
    <Form
      form={form}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 12 }}
      initialValues={initialValues}
      onFinish={handleSubmit}
    >
      <CampusFormItem />

      <Form.Item
        name="group"
        label="分组"
        required
        rules={[{ required: true, message: "请填写你的分组" }]}
      >
        <Select placeholder="请填写你的分组">
          <Select.Option value={MemberGroupEnum.GEEK}>geek</Select.Option>
          <Select.Option value={MemberGroupEnum.OP}>op</Select.Option>
          <Select.Option value={MemberGroupEnum.WEB}>web</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="qq"
        label="QQ"
        extra={
          <Alert message="QQ机器人会用这个QQ号来进行权限认证." type="info" />
        }
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="email"
        label="Email"
        rules={[
          { type: "email", message: "邮箱地址看起来不对..." },
          { required: false },
        ]}
      >
        <Input type="email" />
      </Form.Item>
      <Form.Item
        name="emailNotification"
        label="邮件提醒"
        rules={[
          {
            validator: async (rule, value) => {
              if (Array.isArray(value) && value.length > 0) {
                if (!form.getFieldValue("email")) {
                  return Promise.reject("请先填写Email地址.");
                }
              }
            },
          },
        ]}
      >
        <Checkbox.Group style={{ width: "100%" }}>
          <Row>
            <Col span={24}>
              <Checkbox value="onMyCampusHasNewOrder">
                本校区有新预约单时
              </Checkbox>
            </Col>
            <Col span={24}>
              <Checkbox value="onMyOrderHasNewReply">
                我的预约单有新回复时
              </Checkbox>
            </Col>
          </Row>
        </Checkbox.Group>
      </Form.Item>
      <Form.Item wrapperCol={{ span: 24 }}>
        <CenterMeFlex>
          <Button type="primary" loading={loading} htmlType="submit">
            更新个人信息
          </Button>
        </CenterMeFlex>
      </Form.Item>
    </Form>
  );
};
