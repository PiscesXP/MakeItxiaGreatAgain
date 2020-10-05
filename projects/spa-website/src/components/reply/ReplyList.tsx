import { Avatar, Comment, Divider, List, Modal } from "antd";
import React from "react";
import { ReplyEditor } from "./ReplyEditor";
import { AttachmentList } from "@/components/attachment";
import { utcDateToText } from "@/util/time";
import { MultiLinePlainText } from "@/components/text";

interface ReplyListProps {
  //Modal是否可见
  visible: boolean;
  //Modal的title
  title: string;
  //Modal的onCancel，例如取消可见
  onCancel: () => void;
  //回复的数据
  data: any;
  //发表回复的url path
  postUrl: string;
  //回复成功的回调函数
  onReply: () => void;
  //当postBy为null时，显示的名字(例如预约者的名字)
  anonymousName?: string;
  //是否显示发送邮件提醒的checkbox(预约单回复可选是否用邮件提醒)
  showSendEmailCheckbox?: boolean;
}

/**
 * 回复列表Modal.
 * */
export const ReplyList: React.FC<ReplyListProps> = ({
  visible,
  title,
  onCancel,
  data,
  postUrl,
  onReply,
  anonymousName = "未知姓名",
  showSendEmailCheckbox = false,
}) => {
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
        renderItem={(item: any) => {
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
                content={<MultiLinePlainText content={item.content} />}
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
};
