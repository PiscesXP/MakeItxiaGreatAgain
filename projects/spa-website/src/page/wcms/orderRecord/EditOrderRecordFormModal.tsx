import React, { useEffect } from "react";
import { Form, Input, Modal } from "antd";
import { AttachmentUpload } from "@/components/attachment";
import { RecordTagSelect } from "@/page/wcms/orderRecord/RecordTagSelect";
import { useApiRequest } from "@/hook";

interface EditOrderRecordFormModalProps {
  visible: boolean;
  order: any;
  onSubmit: () => void;
  onHide: () => void;
}

export const EditOrderRecordFormModal: React.FC<EditOrderRecordFormModalProps> = ({
  visible,
  order,
  onSubmit,
  onHide,
}) => {
  const [form] = Form.useForm();
  const { loading, sendRequest } = useApiRequest({
    path: "/orderRecord",
    method: "POST",
    manual: true,
    popModal: {
      onSuccess: {
        content: "发布成功",
      },
      onFail: true,
      onError: true,
    },
    onSuccess: () => {
      form.resetFields();
      onHide();
      onSubmit();
    },
  });

  function handleSubmit(values: any) {
    sendRequest({
      requestBody: values,
    });
  }

  useEffect(() => {
    form.setFieldsValue({
      _id: order?._id,
    });
  }, [form, order]);

  return (
    <Modal
      title="预约单记录"
      visible={visible}
      onCancel={onHide}
      centered
      okText="发布"
      onOk={() => {
        form.submit();
      }}
      okButtonProps={{ loading: loading }}
    >
      <Form form={form} labelCol={{ span: 4 }} onFinish={handleSubmit}>
        <Form.Item name="order" label="预约单ID" initialValue={order?._id}>
          <Input disabled />
        </Form.Item>

        <Form.Item
          name="title"
          label="标 题"
          rules={[
            {
              required: true,
              message: "标题没填噢",
            },
          ]}
          hasFeedback
        >
          <Input placeholder="起个名字真难" />
        </Form.Item>

        <Form.Item
          name="content"
          label="经验记录"
          rules={[
            {
              required: true,
              message: "写点记录...",
            },
          ]}
          hasFeedback
        >
          <Input.TextArea
            autoSize={{ minRows: 4 }}
            placeholder="维修历程，经验..."
            allowClear
          />
        </Form.Item>

        <Form.Item name="tags" label="标 签" initialValue={[]}>
          <RecordTagSelect />
        </Form.Item>

        <AttachmentUpload label="附 件" />
      </Form>
    </Modal>
  );
};
