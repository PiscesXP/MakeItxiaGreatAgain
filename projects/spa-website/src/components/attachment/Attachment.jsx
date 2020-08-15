import React from "react";
import { config } from "CONFIG";
import "./index.css";
import { Divider, Icon, Modal } from "antd";

const { host, protocol } = config.network.api;

class Attachment extends React.Component {
  state = {
    showModal: false,
  };

  onShowModal = () => {
    this.setState({
      showModal: true,
    });
  };

  onHideModal = () => {
    this.setState({
      showModal: false,
    });
  };

  render() {
    const { _id, mimeType, fileName, size } = this.props.data;
    const { showModal } = this.state;
    const isImage = /image/.test(mimeType);
    const url = `${protocol}://${host}/upload/${_id}`;
    const thumbnailUrl = `${url}?thumbnail`;
    const downloadUrl = `${url}?download=1`;
    return (
      <div className="reply-atech">
        {isImage ? (
          <img
            src={thumbnailUrl}
            alt="无法显示图片"
            className="itxia-attachment"
            onClick={this.onShowModal}
          />
        ) : (
          <div className="not-img-atech" onClick={this.onShowModal}>
            <Icon type="file-unknown" className="not-img-icon" />
            <br />
            <span>附件</span>
          </div>
        )}
        <Modal
          visible={showModal}
          title="附件查看"
          onCancel={this.onHideModal}
          okText={
            <a href={downloadUrl} target="_parent">
              下载附件
            </a>
          }
          cancelText="返回"
          centered
        >
          {isImage ? (
            <img src={url} alt="无法显示图片" width="100%" />
          ) : (
            <div className="not-img-atech" onClick={this.onShowModal}>
              <Icon type="file-unknown" className="not-img-icon" />
              <br />
              <span>附件</span>
            </div>
          )}
          <Divider />
          <span>{`文件名: ${fileName}`}</span>
          <br />
          <span>{`类  型: ${mimeType}`}</span>
          <br />
          <span>{`大  小: ${Math.floor(size / 1024) + 1} KB`}</span>
        </Modal>
      </div>
    );
  }
}

export { Attachment };
