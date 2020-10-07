import React, { useEffect, useImperativeHandle, useRef } from "react";
import { Form, Input, Modal } from "antd";
import { AttachmentUpload } from "@/components/attachment";
import { RecordTagSelect } from "./RecordTagSelect";
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
  const ref = useRef<OrderRecordFormRefObject>(null);

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
      ref.current?.resetFields();
      onHide();
      onSubmit();
    },
  });

  function handleSubmit(values: any) {
    sendRequest({
      requestBody: values,
    });
  }

  function handleClickOK() {
    ref.current?.triggerSubmit();
  }

  return (
    <Modal
      title="预约单记录"
      visible={visible}
      onCancel={onHide}
      centered
      okText="发布"
      onOk={handleClickOK}
      okButtonProps={{ loading: loading }}
    >
      <OrderRecordForm ref={ref} order={order} onSubmit={handleSubmit} />
    </Modal>
  );
};

interface OrderRecordFormRefObject {
  triggerSubmit: () => void;
  resetFields: () => void;
}

interface OrderRecordFormProps {
  order: any;
  onSubmit: (formValues: any) => void;
}

const OrderRecordForm = React.forwardRef<
  OrderRecordFormRefObject,
  OrderRecordFormProps
>(({ order, onSubmit }, ref) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      _id: order?._id,
    });
  }, [form, order]);

  useImperativeHandle(ref, () => ({
    triggerSubmit: () => {
      form.submit();
    },
    resetFields: () => {
      form.resetFields();
    },
  }));

  function handleSubmit(values: any) {
    onSubmit(values);
  }

  return (
    <Form form={form} labelCol={{ span: 4 }} onFinish={handleSubmit}>
      <Form.Item name="order" label="预约单ID" initialValue={order?._id} hidden>
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
  );
});
