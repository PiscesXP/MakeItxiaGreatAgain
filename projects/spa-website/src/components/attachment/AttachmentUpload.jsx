import React from "react";
import { Form, Icon, Upload } from "antd";
import { config } from "CONFIG";
import "./AttachmentUpload.css";

const actionUrl =
  config.network.api.protocol + "://" + config.network.api.host + "/upload";

function AttachmentUpload({
  label,
  getFieldDecorator,
  id = "attachments",
  listType = "picture-card",
}) {
  return (
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
          headers={{
            "X-Requested-With": null,
          }}
          withCredentials
          listType={listType}
        >
          <div>
            <Icon type="plus" />
            <div className="ant-upload-text">上传附件</div>
          </div>
        </Upload>
      )}
    </Form.Item>
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
