import { Divider, List, Modal } from "antd";
import React from "react";
import { ReplyEditor } from "./ReplyEditor";
import * as timeUtil from "UTIL/time";
import { AttachmentList } from "COMPONENTS/attachment";

function ReplyList(props) {
  const { visible, title, onCancel, data, postUrl, onReply } = props;
  return (
    <Modal
      visible={visible}
      title={title}
      onCancel={onCancel}
      footer={null}
      centered
    >
      <List
        itemLayout="vertical"
        size="default"
        dataSource={data}
        renderItem={(item) => (
          <List.Item key={item._id}>
            <List.Item.Meta
              description={`由 ${
                item.postBy.realName
              } 发布于 ${timeUtil.utcDateToText(item.createTime)}`}
            />
            <div className="reply-text">
              <p>{item.content}</p>
            </div>
            <AttachmentList data={item.attachments} />
          </List.Item>
        )}
      />
      <Divider />
      <h3>回复评论</h3>
      <ReplyEditor postUrl={postUrl} onReply={onReply} />
    </Modal>
  );
}

export { ReplyList };
