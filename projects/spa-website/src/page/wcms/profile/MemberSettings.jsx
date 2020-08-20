import React from "react";
import { Button, Checkbox, Col, Form, Input, Modal, Row, Select } from "antd";
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
      <Form.Item label="Email" hasFeedback>
        {getFieldDecorator("email", {
          initialValue: context.email,
          rules: [
            { type: "email", message: "邮箱地址看起来不对..." },
            { required: false, message: "请输入邮箱地址" },
          ],
        })(<Input />)}
      </Form.Item>
      <Form.Item label="邮件提醒">
        {getFieldDecorator("emailNotification", {
          initialValue: (() => {
            const { emailNotification } = context;
            if (emailNotification) {
              const result = [];
              for (const propsKey in emailNotification) {
                if (
                  emailNotification.hasOwnProperty(propsKey) &&
                  emailNotification[propsKey] === true
                ) {
                  result.push(propsKey);
                }
              }
              return result;
            } else {
              return [];
            }
          })(),
          rules: [
            (rule, value, callback) => {
              if (value.length !== 0) {
                validateFields(["email"], (error, { email }) => {
                  if (
                    error ||
                    email === "" ||
                    email === null ||
                    email === undefined
                  ) {
                    callback("请先填写Email地址");
                  }
                });
              }
              callback();
            },
          ],
        })(
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
