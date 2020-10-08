import React from "react";
import { Button, Form, Input, Modal } from "antd";
import { RecordTagSelect } from "./RecordTagSelect";
import { useApiRequest } from "@/hook";
import { CenterMeFlex } from "@/components/layout";
import { useOrderRecordTags } from "./OrderRecordTagContext";

interface ModifyOrderRecordModalProps {
  visible: boolean;
  record: any;
  refresh: () => void;
  onHide: () => void;
}

export const ModifyOrderRecordModal: React.FC<ModifyOrderRecordModalProps> = ({
  visible,
  record,
  refresh,
  onHide,
}) => {
  const tagsContext = useOrderRecordTags();

  const { loading, sendRequest } = useApiRequest({
    path: `/orderRecord/${record?._id}`,
    method: "PUT",
    manual: true,
    popModal: {
      onSuccess: {
        content: "修改成功",
      },
      onFail: true,
      onError: true,
    },
    onSuccess: () => {
      onHide();
      refresh();
      tagsContext.refreshTags();
    },
  });

  function handleSubmit(values: any) {
    sendRequest({ requestBody: values });
  }

  return (
    <Modal
      title="修改记录"
      visible={visible}
      onCancel={onHide}
      centered
      footer={null}
    >
      <Form
        labelCol={{ span: 4 }}
        initialValues={record}
        onFinish={handleSubmit}
      >
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

        <Form.Item name="tags" label="标 签">
          <RecordTagSelect />
        </Form.Item>

        <CenterMeFlex>
          <Form.Item wrapperCol={{ span: 24, offset: 0 }}>
            <Button type="primary" htmlType="submit" loading={loading}>
              提交修改
            </Button>
          </Form.Item>
        </CenterMeFlex>
      </Form>
    </Modal>
  );
};
