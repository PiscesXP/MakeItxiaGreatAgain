import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, Input, Modal, Radio } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import "./announcementEditor.css";
import {
  AttachmentUpload,
  attachmentUploadFormParser,
} from "COMPONENTS/attachment";
import { useLocalStorageState, useThrottle } from "HOOK";

/**
 * 公告编辑器.
 */
function EditorForm({
  form: { validateFields, resetFields, getFieldDecorator, setFieldsValue },
  editingAnnounceID,
  onSubmitAnnouncement,
}) {
  const [draft, setDraft, removeDraft] = useLocalStorageState(
    "announceEditDraft"
  );

  const [loading, setLoading] = useState(false);

  const isEditingOldAnnounce = useMemo(() => !!editingAnnounceID, [
    editingAnnounceID,
  ]);

  /**
   * 验证表单，通过后发送请求.
   * */
  function handleSubmit(e) {
    e.preventDefault();
    validateFields((err, values) => {
      if (err) {
        return;
      }
      values.attachments = attachmentUploadFormParser(values.attachments);
      setLoading(true);
      onSubmitAnnouncement(values)
        .then(() => {
          resetFields(); //发布成功后清空表单，防止重复提交
          removeDraft();
        })
        .catch((error) => {
          Modal.error({
            title: "发布失败",
            content: error.toString(),
            centered: true,
          });
        })
        .finally(() => {
          setLoading(false);
        });
    });
  }

  //-----------------------------------------------------------
  //自动存草稿，有草稿时提示恢复
  const saveDraft = useThrottle(() => {
    validateFields((err, values) => {
      if (err) {
        return;
      }
      const { attachments, ...valuesToSave } = values;
      setDraft(valuesToSave);
    });
  }, 5000);

  useEffect(() => {
    if (draft) {
      //提示是否恢复草稿
      Modal.confirm({
        title: "是否恢复上次编辑的内容？",
        centered: true,
        okText: "恢复",
        cancelText: "不用了",
        onOk: () => {
          setFieldsValue(draft);
        },
        onCancel: () => {
          removeDraft();
        },
      });
    }
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, []);
  //-----------------------------------------------------------

  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 12 },
  };
  return (
    <Form {...formItemLayout} onSubmit={handleSubmit} onChange={saveDraft}>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <h1>
          {isEditingOldAnnounce ? (
            <span>修改旧公告</span>
          ) : (
            <span>发布新公告</span>
          )}
        </h1>
      </div>
      {isEditingOldAnnounce ? (
        <Form.Item label="ID">
          {getFieldDecorator("_id", {
            initialValue: editingAnnounceID,
          })(<Input disabled />)}
        </Form.Item>
      ) : null}
      <Form.Item label="标题">
        {getFieldDecorator("title", {
          rules: [{ required: true, message: "请输入标题" }],
        })(<Input />)}
      </Form.Item>
      <Form.Item label="公告类型">
        {getFieldDecorator("type", {
          rules: [{ required: true, message: "请选择公告类型" }],
        })(
          <Radio.Group disabled={isEditingOldAnnounce}>
            <Radio value="INTERNAL">后台系统公告</Radio>
            <Radio value="EXTERNAL">预约页面公告</Radio>
          </Radio.Group>
        )}
      </Form.Item>
      <Form.Item label="公告内容">
        {getFieldDecorator("content", {
          rules: [{ required: true, message: "请填写公告内容" }],
        })(
          <Input.TextArea
            autoSize={{ minRows: 6 }}
            allowClear={true}
            placeholder="支持markdown格式"
          />
        )}
      </Form.Item>
      {isEditingOldAnnounce ? (
        <Form.Item label="附件上传">暂不支持修改附件</Form.Item>
      ) : (
        <AttachmentUpload
          label="附件上传"
          getFieldDecorator={getFieldDecorator}
          id="attachments"
        />
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
}

const AnnouncementEditor = Form.create({
  mapPropsToFields: ({ editingAnnounceID, originAnnounce }) => {
    if (!!!editingAnnounceID || !!!originAnnounce) {
      return null;
    }
    const { title, type, content } = originAnnounce;
    return {
      title: Form.createFormField({ value: title }),
      type: Form.createFormField({ value: type }),
      content: Form.createFormField({ value: content }),
    };
  },
})(EditorForm);
export { AnnouncementEditor };
