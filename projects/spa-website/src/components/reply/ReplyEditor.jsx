import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, Checkbox, Input, Modal } from "antd";
import React from "react";
import { useApi } from "HOOK";
import {
  AttachmentUpload,
  attachmentUploadFormParser,
} from "COMPONENTS/attachment";
import { CenterMeFlex } from "COMPONENTS/layout";

const { TextArea } = Input;

/**
 * @param getFieldDecorator {function}
 * @param validateFields {function}
 * @param resetFields {function}
 * @param postUrl {string} 发送回复请求的url path
 * @param onReply {function} 回复成功的回调函数
 * @param showSendEmailCheckbox {boolean} 是否显示发送邮件提醒的checkbox(预约单回复可选是否用邮件提醒)
 * */
function ReplyEditorForm({
  form: { getFieldDecorator, validateFields, resetFields },
  postUrl,
  onReply,
  showSendEmailCheckbox = false,
}) {
  const { loading, send } = useApi({
    path: postUrl,
    method: "POST",
    later: true,
    onSuccess: () => {
      Modal.success({
        title: "回复成功",
        centered: true,
      });
      onReply();
      resetFields();
    },
    onFail: ({ message }) => {
      Modal.error({
        title: "回复失败",
        content: message,
        centered: true,
      });
    },
    onError: (error) => {
      Modal.error({
        title: "回复失败",
        content: error.toString(),
        centered: true,
      });
    },
  });

  function onSubmit(e) {
    e.preventDefault();
    validateFields((err, values) => {
      if (err) {
        return;
      }
      values.attachments = attachmentUploadFormParser(values.attachments);
      send(values);
    });
  }

  return (
    <Form onSubmit={onSubmit}>
      <Form.Item>
        {getFieldDecorator("content", {
          rules: [{ required: true, message: "请填写回复内容" }],
        })(<TextArea autoSize={{ minRows: 2, maxRows: 8 }} />)}
      </Form.Item>
      {showSendEmailCheckbox ? (
        <Form.Item>
          {getFieldDecorator("sendEmailNotification", {
            valuePropName: "checked",
            initialValue: true,
          })(<Checkbox>发邮件提醒他/她有新消息</Checkbox>)}
        </Form.Item>
      ) : null}
      <AttachmentUpload
        getFieldDecorator={getFieldDecorator}
        label="附件上传"
        id="attachments"
      />
      <Form.Item wrapperCol={{ span: 24, offset: 0 }}>
        <CenterMeFlex>
          <Button htmlType="submit" loading={loading} type="primary">
            发送回复
          </Button>
        </CenterMeFlex>
      </Form.Item>
    </Form>
  );
}

const ReplyEditor = Form.create()(ReplyEditorForm);

export { ReplyEditor };
