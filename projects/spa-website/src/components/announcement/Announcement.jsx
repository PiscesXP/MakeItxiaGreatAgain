import React, { useState } from "react";
import { Icon as LegacyIcon } from '@ant-design/compatible';
import { MessageOutlined } from '@ant-design/icons';
import { List } from "antd";
import { AttachmentList } from "COMPONENTS/attachment";
import { ReplyList } from "COMPONENTS/reply";
import * as timeUtil from "UTIL/time";
import { ReactMarkdown } from "UTIL/md2html";
import * as api from "@/request/api";
import { useMemberContext } from "HOOK";

/**
 * 单个公告展示.
 */
function Announcement(props) {
  const { data, onUpdate, showActions } = props;
  const {
    _id,
    title,
    content,
    attachments,
    createTime,
    postBy,
    likedBy,
    comments,
  } = data;

  const [showReply, setShowReply] = useState(false);

  const userInfoContext = useMemberContext();

  //是否已点赞
  const isLiked =
    likedBy.findIndex((likedBySomeone) => {
      return likedBySomeone._id === userInfoContext._id;
    }) !== -1;

  async function hitLikeButton() {
    try {
      await api.PUT(`/announcement/${_id}/${isLiked ? "unlike" : "like"}`);
      onUpdate();
    } catch (error) {}
  }

  return (
    <List.Item
      actions={
        showActions
          ? [
              <span key="1" onClick={hitLikeButton}>
                <LegacyIcon
                  type="like"
                  theme={isLiked ? "twoTone" : "outlined"}
                  style={{ marginRight: 8 }}
                />
                {likedBy.length}
              </span>,
              <span
                key="2"
                onClick={() => {
                  setShowReply(true);
                }}
              >
                <MessageOutlined style={{ marginRight: 8 }} />
                {comments.length}
              </span>,
            ]
          : []
      }
    >
      <List.Item.Meta
        title={title}
        description={`由 ${postBy.realName} 发布于 ${timeUtil.utcDateToText(
          createTime
        )}`}
      />
      <ReactMarkdown source={content} />
      <br />
      <AttachmentList data={attachments} />
      <ReplyList
        visible={showReply}
        title={`公告 ${title} 的评论区`}
        onCancel={() => {
          setShowReply(false);
        }}
        data={comments}
        postUrl={`/announcement/${_id}/comment`}
        onReply={onUpdate}
      />
    </List.Item>
  );
}

export { Announcement };
