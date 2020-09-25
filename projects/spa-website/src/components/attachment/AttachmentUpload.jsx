import React, { useState } from "react";
import { PlusOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Modal, Upload } from "antd";
import { config } from "CONFIG";
import "./AttachmentUpload.css";

const actionUrl = config.network.api.prefix + "/upload";

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

function AttachmentUpload({
  label,
  getFieldDecorator,
  id = "attachments",
  listType = "picture-card",
  children,
}) {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  async function handlePreview(file) {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.preview);
    setPreviewVisible(true);
  }

  function cancelPreview() {
    setPreviewVisible(false);
  }

  return (
    <div>
      <Form.Item label={label}>
        {getFieldDecorator(id, {
          valuePropName: "fileList",
          getValueFromEvent: (e) => {
            if (Array.isArray(e)) {
              return e;
            }
            return e && e.fileList;
          },
        })(
          <Upload
            action={actionUrl}
            listType={listType}
            onPreview={handlePreview}
          >
            <div>
              <PlusOutlined />
              <div className="ant-upload-text">上传附件</div>
            </div>
          </Upload>
        )}
        {children}
      </Form.Item>
      <Modal
        centered
        visible={previewVisible}
        footer={null}
        onCancel={cancelPreview}
      >
        <img alt="preview" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </div>
  );
}

function attachmentUploadFormParser(uploadFormValue) {
  if (Array.isArray(uploadFormValue)) {
    return uploadFormValue
      .filter(
        (file) =>
          file.percent === 100 &&
          file.status === "done" &&
          file.response.code === 0
      )
      .map((file) => file.response.payload._id);
  }
  return [];
}

export { AttachmentUpload, attachmentUploadFormParser };
