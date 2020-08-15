import React from "react";
import { Button, Col, Form, Modal, Row, Select } from "antd";
import { useApi, useMemberContext } from "HOOK";

function MemberSettingsForm(props) {
  const { getFieldDecorator, validateFields } = props.form;

  const context = useMemberContext();

  const { loading, send } = useApi({
    path: "/member/me/profile",
    method: "PUT",
    data: null,
    later: true,
    onSuccess: () => {
      Modal.success({
        content: "修改成功",
        centered: true,
        onOk: () => {
          //重新加载页面，刷新context
          window.location.reload();
        },
      });
    },
    onFail: ({ message }) => {
      Modal.error({
        title: "修改失败",
        content: message,
        centered: true,
      });
    },
  });

  function handleSubmit(e) {
    e.preventDefault();
    validateFields((err, values) => {
      if (err) {
        return;
      }
      send(values);
    });
  }

  return (
    <Form
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 12 }}
      onSubmit={handleSubmit}
    >
      <Form.Item label="校区" hasFeedback>
        {getFieldDecorator("campus", {
          rules: [{ required: true, message: "请选择你的校区" }],
          initialValue: context.campus,
        })(
          <Select placeholder="请选择你的校区">
            <Select.Option value={"XIANLIN"}>仙林</Select.Option>
            <Select.Option value={"GULOU"}>鼓楼</Select.Option>
          </Select>
        )}
      </Form.Item>
      <Form.Item wrapperCol={{ span: 24 }}>
        <Row type="flex" align="middle" justify="center">
          <Col>
            <Button type="primary" loading={loading} htmlType="submit">
              更新个人信息
            </Button>
          </Col>
        </Row>
      </Form.Item>
    </Form>
  );
}

const MemberSettings = Form.create()(MemberSettingsForm);

export { MemberSettings };
