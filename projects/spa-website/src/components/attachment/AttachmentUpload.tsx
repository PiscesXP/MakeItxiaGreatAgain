import React, { useRef, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Form, Modal, Upload } from "antd";
import { config } from "@/config";
import "./AttachmentUpload.css";

const actionUrl = config.network.api.prefix + "/upload";

function getBase64(file: Blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

declare type UploadListType = "picture-card" | "picture" | "text" | undefined;

interface AttachmentUploadProps {
  //Form.Item name
  name?: string;
  //Form.Item label
  label?: string;
  //Upload list type
  listType?: UploadListType;
}

/**
 *
 * 附件上传组件.
 * 已包含Form.Item.
 * */
export const AttachmentUpload: React.FC<AttachmentUploadProps> = ({
  label,
  name = "attachments",
  listType = "picture-card",
  children,
}) => {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | undefined>();

  async function handlePreview(file: any) {
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
    <>
      <Form.Item name={name} label={label}>
        <UploadInput listType={listType} handlePreview={handlePreview}>
          {children}
        </UploadInput>
      </Form.Item>
      <Modal
        centered
        visible={previewVisible}
        footer={null}
        onCancel={cancelPreview}
      >
        <img alt="preview" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </>
  );
};

/**
 * TODO remove this
 * @deprecated
 * */
export function attachmentUploadFormParser(uploadFormValue: any[]) {
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

const UploadInput: React.FC<{
  value?: string[];
  listType: UploadListType;
  onChange?: (fileList: any[]) => void;
  handlePreview: (a: any) => any;
}> = ({ value = [], listType, onChange, handlePreview, children }) => {
  const ref = useRef<string[]>(value);
  return (
    <>
      <Upload
        action={actionUrl}
        listType={listType}
        onPreview={handlePreview}
        onChange={(e: any) => {
          const uploadIDArr = e.fileList
            .filter(
              (file: any) =>
                file.percent === 100 &&
                file.status === "done" &&
                file.response.code === 0
            )
            .map((file: any) => file.response.payload._id);
          uploadIDArr.fileList = e.fileList;
          ref.current = uploadIDArr;
          if (onChange) {
            onChange(uploadIDArr);
          }
        }}
      >
        <div>
          <PlusOutlined />
          <div className="ant-upload-text">上传附件</div>
        </div>
      </Upload>
      {children}
    </>
  );
};
