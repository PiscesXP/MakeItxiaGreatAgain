import { Button, Checkbox, Form, Input } from "antd";
import React from "react";
import { AttachmentUpload } from "@/components/attachment";
import { CenterMeFlex } from "@/components/layout";
import { useApiRequest } from "@/hook/useApiRequest";

const { TextArea } = Input;

interface ReplyEditorProps {
  //发送回复请求的url path
  postUrl: string;
  //回复成功的回调函数
  onReply: () => void;
  //是否显示发送邮件提醒的checkbox(预约单回复可选是否用邮件提醒)
  showSendEmailCheckbox?: boolean;
}

/**
 * 回复消息的编辑器.
 * */
export const ReplyEditor: React.FC<ReplyEditorProps> = ({
  postUrl,
  onReply,
  showSendEmailCheckbox = false,
}) => {
  const [form] = Form.useForm();

  const { loading, sendRequest } = useApiRequest({
    path: postUrl,
    method: "POST",
    manual: true,
    popModal: {
      onSuccess: { title: "回复成功" },
      onFail: true,
      onError: true,
    },
    onSuccess: () => {
      onReply();
      form.resetFields();
    },
  });

  function handleSubmit(values: any) {
    sendRequest({ requestBody: values });
  }

  return (
    <Form form={form} onFinish={handleSubmit}>
      <Form.Item
        name="content"
        rules={[{ required: true, message: "请填写回复内容" }]}
      >
        <TextArea autoSize={{ minRows: 2, maxRows: 8 }} />
      </Form.Item>
      {showSendEmailCheckbox && (
        <Form.Item
          name="sendEmailNotification"
          valuePropName="checked"
          initialValue={true}
        >
          <Checkbox>发邮件提醒他/她有新消息</Checkbox>
        </Form.Item>
      )}
      <AttachmentUpload label="附件上传" name="attachments" />
      <Form.Item wrapperCol={{ span: 24, offset: 0 }}>
        <CenterMeFlex>
          <Button htmlType="submit" loading={loading} type="primary">
            发送回复
          </Button>
        </CenterMeFlex>
      </Form.Item>
    </Form>
  );
};
