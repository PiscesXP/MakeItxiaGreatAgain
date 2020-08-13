import { Button, Form, Input, Modal, Radio } from "antd";
import React, { useEffect } from "react";
import "./announcementEditor.css";
import {
  AttachmentUpload,
  attachmentUploadFormParser
} from "COMPONENTS/attachment";
import { useApi, useLocalStorage, useThrottle } from "HOOK";

/**
 * 公告编辑器.
 */
function EditorForm({
  form: { validateFields, resetFields, getFieldDecorator, setFieldsValue }
}) {
  const [draft, setDraft, removeDraft] = useLocalStorage("announceEditDraft");

  const { loading, send, emitter } = useApi({
    path: "/announcement",
    method: "POST",
    later: true
  });
  emitter
    .onSuccess(() => {
      Modal.success({
        title: "发布成功",
        centered: true
      });
      resetFields(); //发布成功后清空表单，防止重复提交
      removeDraft();
    })
    .onFail(({ message }) => {
      Modal.error({
        title: "发布失败",
        content: message,
        centered: true
      });
    })
    .onError(e => {
      Modal.error({
        title: "发布失败",
        content: e.toString(),
        centered: true
      });
    });

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
      send(values);
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
        }
      });
    }
  }, []);
  //-----------------------------------------------------------

  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 12 }
  };
  return (
    <Form {...formItemLayout} onSubmit={handleSubmit} onChange={saveDraft}>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <h1>公告编辑</h1>
      </div>
      <Form.Item label="标题">
        {getFieldDecorator("title", {
          rules: [{ required: true, message: "请输入标题" }]
        })(<Input />)}
      </Form.Item>
      <Form.Item label="公告类型">
        {getFieldDecorator("type", {
          rules: [{ required: true, message: "请选择公告类型" }]
        })(
          <Radio.Group>
            <Radio value="INTERNAL">内部公告</Radio>
            <Radio value="EXTERNAL">外部公告</Radio>
          </Radio.Group>
        )}
      </Form.Item>
      <Form.Item label="公告内容">
        {getFieldDecorator("content", {
          rules: [{ required: true, message: "请填写公告内容" }]
        })(
          <Input.TextArea
            autoSize={{ minRows: 6 }}
            allowClear={true}
            placeholder="支持markdown格式"
          />
        )}
      </Form.Item>
      <AttachmentUpload
        label="附件上传"
        getFieldDecorator={getFieldDecorator}
        id="attachments"
      />

      <Form.Item wrapperCol={{ span: 24, offset: 0 }}>
        <div id="announce-edit-btn-container">
          <Button type="primary" htmlType="submit" loading={loading}>
            发布公告
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
}

const AnnouncementEditor = Form.create()(EditorForm);
export { AnnouncementEditor };
