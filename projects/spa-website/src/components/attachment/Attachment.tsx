import React, { useState } from "react";
import { config } from "@/config";
import "./index.css";
import { FileUnknownOutlined } from "@ant-design/icons";
import { Divider, Modal } from "antd";

interface AttachmentProps {
  data: any;
}

export const Attachment: React.FC<AttachmentProps> = ({ data }) => {
  const [showModal, setShowModal] = useState<boolean>(false);

  function onShowModal() {
    setShowModal(true);
  }

  function onHideModal() {
    setShowModal(false);
  }

  const { _id, mimeType, fileName, size } = data;
  const isImage = /image/.test(mimeType);
  const url = `${config.network.api.prefix}/upload/${_id}`;
  const thumbnailUrl = `${url}?thumbnail`;
  const downloadUrl = `${url}?download=1`;

  return (
    <div className="reply-atech">
      {isImage ? (
        <img
          src={thumbnailUrl}
          alt="无法显示图片"
          className="itxia-attachment"
          onClick={onShowModal}
        />
      ) : (
        <div className="not-img-atech" onClick={onShowModal}>
          <FileUnknownOutlined className="not-img-icon" />
          <br />
          <span>附件</span>
        </div>
      )}
      <Modal
        visible={showModal}
        title="附件查看"
        onCancel={onHideModal}
        okText={
          <a href={downloadUrl} target="_parent">
            下载原文件
          </a>
        }
        cancelText="返回"
        centered
      >
        {isImage ? (
          <img src={url} alt="无法显示图片" width="100%" />
        ) : (
          <div className="not-img-atech">
            <FileUnknownOutlined className="not-img-icon" />
            <br />
            <span>附件</span>
          </div>
        )}
        <Divider />
        <span>{`文件原名: ${fileName}`}</span>
        <br />
        <span>{`文件类型: ${mimeType}`}</span>
        <br />
        <span>{`原始大小: ${Math.floor(size / 1024) + 1} KB`}</span>
      </Modal>
    </div>
  );
};
