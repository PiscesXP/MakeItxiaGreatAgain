import { Avatar, Comment, Divider, List, Modal } from "antd";
import React from "react";
import { ReplyEditor } from "./ReplyEditor";
import { AttachmentList } from "COMPONENTS/attachment";
import { utcDateToText } from "UTIL/time";

/**
 * @param visible {boolean} Modal是否可见
 * @param title {string} Modal的title
 * @param onCancel {function} Modal的onCancel，例如取消可见
 * @param data {[Object]} 回复的数据
 * @param postUrl {string} 发表回复的url path
 * @param onReply {function} 回复成功的回调函数
 * @param anonymousName {string} 当postBy为null时，显示的名字(例如预约者的名字)
 * @param showSendEmailCheckbox {boolean} 是否显示发送邮件提醒的checkbox(预约单回复可选是否用邮件提醒)
 * */
function ReplyList({
  visible,
  title,
  onCancel,
  data,
  postUrl,
  onReply,
  anonymousName = "未知姓名",
  showSendEmailCheckbox = false,
}) {
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
        renderItem={(item) => {
          let realName;
          if (item.postBy && item.postBy.realName) {
            realName = item.postBy.realName;
          } else {
            realName = anonymousName;
          }
          return (
            <li>
              <Comment
                avatar={<Avatar>{realName.charAt(realName.length - 1)}</Avatar>}
                author={realName}
                datetime={utcDateToText(item.createTime)}
                content={item.content}
              >
                <AttachmentList data={item.attachments} />
              </Comment>
            </li>
          );
        }}
      />
      <Divider />
      <h3>回复消息</h3>
      <ReplyEditor
        postUrl={postUrl}
        onReply={onReply}
        showSendEmailCheckbox={showSendEmailCheckbox}
      />
    </Modal>
  );
}

export { ReplyList };
