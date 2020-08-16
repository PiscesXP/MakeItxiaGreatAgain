import { Button, Form, Input, Modal } from "antd";
import React from "react";
import { useApi } from "HOOK";
import {
  AttachmentUpload,
  attachmentUploadFormParser,
} from "COMPONENTS/attachment";

const { TextArea } = Input;

function ReplyEditorForm({
  form: { getFieldDecorator, validateFields, resetFields },
  postUrl,
  onReply,
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
      <AttachmentUpload
        getFieldDecorator={getFieldDecorator}
        label="附件上传"
        id="attachments"
      />
      <Form.Item>
        <Button htmlType="submit" loading={loading} type="primary">
          发送回复
        </Button>
      </Form.Item>
    </Form>
  );
}

const ReplyEditor = Form.create()(ReplyEditorForm);

export { ReplyEditor };
