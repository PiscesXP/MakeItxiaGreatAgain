import { Button, Form, Input, Modal, Radio } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import { useLocalStorageState } from "@/hook/useLocalStorageState";
import "./announcementEditor.css";
import { ApiRequestResult, ApiRequestStateEnum } from "@/request/types";
import { useThrottle } from "@/hook/useThrottle";
import { useMount } from "@/hook/useMount";
import { AttachmentUpload } from "@/components/attachment";

interface AnnouncementEditorProps {
  editingAnnounceID?: string | null;
  originAnnounce?: any;
  onSubmitAnnouncement: (formValues: any) => Promise<ApiRequestResult>;
}

/**
 * 公告编辑器.
 */
export const AnnouncementEditor: React.FC<AnnouncementEditorProps> = ({
  editingAnnounceID,
  originAnnounce,
  onSubmitAnnouncement,
}) => {
  const [draft, setDraft, removeDraft] = useLocalStorageState(
    "announceEditDraft",
    null
  );

  const [loading, setLoading] = useState(false);

  const isEditingOldAnnounce = useMemo(() => !!editingAnnounceID, [
    editingAnnounceID,
  ]);

  const [form] = Form.useForm();

  useEffect(() => {
    if (isEditingOldAnnounce && !!originAnnounce) {
      const { attachments, ...rest } = originAnnounce;
      form.setFieldsValue(rest);
    } else {
      form.resetFields();
    }
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [isEditingOldAnnounce]);

  /**
   * 验证表单，通过后发送请求.
   * */
  async function handleSubmit(formValues: any) {
    setLoading(true);
    const result = await onSubmitAnnouncement(formValues);
    if (result.state === ApiRequestStateEnum.success) {
      removeDraft();
      form.resetFields();
    }
    setLoading(false);
  }

  //-----------------------------------------------------------
  //自动存草稿，有草稿时提示恢复
  const saveDraft = useThrottle((changedValues: any, allValues: any) => {
    const { attachments, ...valuesToSave } = allValues;
    setDraft(valuesToSave);
  }, 5000);

  useMount(() => {
    if (draft) {
      //提示是否恢复草稿
      Modal.confirm({
        title: "是否恢复上次编辑的内容？",
        centered: true,
        okText: "恢复",
        cancelText: "不用了",
        onOk: () => {
          form.setFieldsValue(draft);
        },
        onCancel: () => {
          removeDraft();
        },
      });
    }
  });
  //-----------------------------------------------------------

  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 12 },
  };
  return (
    <Form
      {...formItemLayout}
      form={form}
      onFinish={handleSubmit}
      onValuesChange={saveDraft}
    >
      <div style={{ display: "flex", justifyContent: "center" }}>
        <h1>
          {isEditingOldAnnounce ? (
            <span>修改旧公告</span>
          ) : (
            <span>发布新公告</span>
          )}
        </h1>
      </div>

      {isEditingOldAnnounce && (
        <Form.Item name="_id" label="ID" initialValue={editingAnnounceID}>
          <Input disabled />
        </Form.Item>
      )}

      <Form.Item
        name="title"
        label="标题"
        rules={[{ required: true, message: "请输入标题" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="type"
        label="公告类型"
        rules={[{ required: true, message: "请选择公告类型" }]}
      >
        <Radio.Group disabled={isEditingOldAnnounce}>
          <Radio value="INTERNAL">后台系统公告</Radio>
          <Radio value="EXTERNAL">预约页面公告</Radio>
        </Radio.Group>
      </Form.Item>

      <Form.Item
        name="content"
        label="公告内容"
        rules={[{ required: true, message: "请填写公告内容" }]}
      >
        <Input.TextArea
          autoSize={{ minRows: 6 }}
          allowClear={true}
          placeholder="支持markdown格式"
        />
      </Form.Item>
      {isEditingOldAnnounce ? (
        <Form.Item label="附件上传">暂不支持修改附件</Form.Item>
      ) : (
        <AttachmentUpload label="附件上传" />
      )}

      <Form.Item wrapperCol={{ span: 24, offset: 0 }}>
        <div id="announce-edit-btn-container">
          <Button type="primary" htmlType="submit" loading={loading}>
            {isEditingOldAnnounce ? "修改公告" : "发布公告"}
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
};
