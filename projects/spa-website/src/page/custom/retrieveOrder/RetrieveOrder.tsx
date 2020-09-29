import React from "react";
import { Button, Card, Form, Input } from "antd";
import { CenterMeFlex } from "@/components/layout";
import { useTitleCustom } from "@/hook/useTitle";
import { useHistory } from "react-router-dom";
import { routePath } from "@/page/routePath";
import { useApiRequest } from "@/hook/useApiRequest";
import { useCustomContext } from "@/page/custom/CustomContext";

export const RetrieveOrder: React.FC = () => {
  useTitleCustom("找回预约单");

  const history = useHistory();

  const customContext = useCustomContext();

  const { loading, sendRequest } = useApiRequest({
    path: "/custom/order/retrieve",
    method: "POST",
    manual: true,
    popModal: {
      onSuccess: {
        title: "已找到预约单",
        content: "你可重新查看预约单信息",
        cancelText: "",
        onOk: () => {
          history.push(routePath.custom.ORDER);
        },
      },
      onFail: {
        title: "未找到预约单",
        content: "请确认输入的信息是否和预约时的一致",
      },
      onError: true,
    },
    onSuccess: ({ payload }) => {
      customContext.retrieveExistedOrder(payload);
    },
  });

  function handleSubmit(values: any) {
    sendRequest({ requestBody: values });
  }

  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };
  return (
    <Card title="找回预约单 - 请填写预约时提供的信息">
      <Form {...formItemLayout} onFinish={handleSubmit}>
        <Form.Item
          name="name"
          label="姓名"
          rules={[{ required: true, message: "请输入姓名" }]}
          hasFeedback
        >
          <Input placeholder="你的名字" />
        </Form.Item>

        <Form.Item
          name="phone"
          label="手机号"
          rules={[{ required: true, message: "请输入手机号" }]}
          hasFeedback
        >
          <Input placeholder="预约时的手机号" />
        </Form.Item>

        <Form.Item wrapperCol={{ span: 24, offset: 0 }}>
          <CenterMeFlex>
            <Button type="primary" htmlType="submit" loading={loading}>
              找回预约单
            </Button>
          </CenterMeFlex>
        </Form.Item>
      </Form>
    </Card>
  );
};
