import React, { useMemo, useRef, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Form, Modal, Upload } from "antd";
import { config } from "@/config";
import "./AttachmentUpload.css";
import { UploadFile, UploadListType } from "antd/es/upload/interface";

const actionUrl = config.network.api.prefix + "/upload";

function getBase64(file: Blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

interface ExistedFile {
  readonly _id: string;
  readonly url: string;
  readonly fileName: string;
  readonly size: number;
  readonly mimeType: string;
}

interface AttachmentUploadProps {
  //Form.Item name
  name?: string;
  //Form.Item label
  label?: string;
  //Upload list type
  listType?: UploadListType;
  existedFileList?: ExistedFile[];
  //Form.Item extra
  extra?: React.ReactNode;
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
  existedFileList = [],
  extra,
}) => {
  return (
    <Form.Item name={name} label={label} extra={extra} initialValue={[]}>
      <UploadInput existedFileList={existedFileList} listType={listType} />
    </Form.Item>
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
  existedFileList: ExistedFile[];
  onChange?: (fileList: any[]) => void;
  // handlePreview: (a: any) => any;
}> = ({
  value = [],
  listType,
  existedFileList = [],
  onChange,
  // handlePreview,
}) => {
  const ref = useRef<string[]>(value);

  const fileList = useMemo<UploadFile[]>(() => {
    return existedFileList.map((file) => {
      return {
        uid: file._id,
        status: "done",
        size: file.size,
        name: file.fileName,
        type: file.mimeType,
      };
    });
  }, [existedFileList]);

  const [previewVisible, setPreviewVisible] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string | undefined>();

  async function handlePreview(file: any) {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
      setPreviewImage(file.preview);
    } else {
      setPreviewImage(file.url);
    }
    setPreviewVisible(true);
  }

  function cancelPreview() {
    setPreviewVisible(false);
  }

  function handleRemove() {
    return new Promise<boolean>((resolve, reject) => {
      Modal.confirm({
        title: "确认删除附件嘛",
        centered: true,
        onOk: () => {
          resolve();
        },
        onCancel: () => {
          reject();
        },
      });
    });
  }

  function handleChange(e: any) {
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
  }

  return (
    <>
      <Upload
        action={actionUrl}
        listType={listType}
        defaultFileList={fileList}
        onPreview={handlePreview}
        onRemove={handleRemove}
        onChange={handleChange}
      >
        <div>
          <PlusOutlined />
          <div className="ant-upload-text">上传附件</div>
        </div>
      </Upload>
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
