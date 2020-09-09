import React from "react";
import { Button, Card, Form, Input, Modal } from "antd";
import { CenterMeFlex } from "COMPONENTS/layout";
import { useApi, useTitleCustom } from "HOOK/index";
import { useHistory } from "react-router-dom";
import { routePath } from "PAGE/routePath";

function RetrieveOrderForm({
  form: { getFieldDecorator, validateFieldsAndScroll },
}) {
  useTitleCustom("找回预约单");

  const history = useHistory();

  const { loading, send } = useApi({
    path: "/custom/order/retrieve",
    method: "POST",
    later: true,
    onSuccess: ({ payload }) => {
      console.log(payload);
      //存储预约单ID
      window.localStorage.setItem("requestedOrderId", payload);
      Modal.success({
        title: "已找到预约单",
        content: "你可重新查看预约单信息",
        centered: true,
        onOk: () => {
          history.push(routePath.custom.ORDER);
        },
        cancelText: "",
      });
    },
    onFail: ({ payload }) => {
      Modal.error({
        title: "未找到预约单",
        content: "请确认输入的信息是否和预约时的一致",
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

  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };
  return (
    <Card title="找回预约单 - 请填写预约时提供的信息">
      <Form {...formItemLayout} onSubmit={handleSubmit}>
        <Form.Item label="姓名" hasFeedback>
          {getFieldDecorator("name", {
            rules: [{ required: true, message: "请输入姓名" }],
          })(<Input />)}
        </Form.Item>

        <Form.Item label="手机号" hasFeedback>
          {getFieldDecorator("phone", {
            rules: [{ required: true, message: "请输入手机号" }],
          })(<Input />)}
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
}

const RetrieveOrder = Form.create()(RetrieveOrderForm);

export { RetrieveOrder };
