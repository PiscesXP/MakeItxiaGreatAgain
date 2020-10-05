import React, { useState } from "react";
import { LikeOutlined, LikeTwoTone, MessageOutlined } from "@ant-design/icons";
import { List } from "antd";
import { AttachmentList } from "@/components/attachment";
import { ReplyList } from "@/components/reply";
import * as timeUtil from "@/util/time";
import { ReactMarkdown } from "@/util/md2html";
import * as api from "@/request/api";
import { useMemberContext } from "@/hook/useMemberContext";
import "./singleAnnouncement.css";

interface SingleAnnouncementProps {
  data: any;
  refresh: () => void;
  showActions: boolean;
}

/**
 * 单个公告展示.
 */
export const SingleAnnouncement: React.FC<SingleAnnouncementProps> = (
  props
) => {
  const { data, refresh, showActions } = props;
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

  const memberContext = useMemberContext();

  //是否已点赞
  const isLiked =
    likedBy.findIndex((likedBySomeone: any) => {
      return likedBySomeone._id === memberContext._id;
    }) !== -1;

  async function hitLikeButton() {
    await api.PUT(`/announcement/${_id}/${isLiked ? "unlike" : "like"}`);
    refresh();
  }

  return (
    <List.Item
      actions={
        showActions
          ? [
              <span
                key="1"
                onClick={hitLikeButton}
                className="announcement-action"
              >
                {isLiked ? (
                  <LikeTwoTone className="announcement-action-icon" />
                ) : (
                  <LikeOutlined className="announcement-action-icon" />
                )}
                {likedBy.length}
              </span>,
              <span
                key="2"
                onClick={() => {
                  setShowReply(true);
                }}
                className="announcement-action"
              >
                <MessageOutlined className="announcement-action-icon" />
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
      <AttachmentList data={attachments} />
      <ReplyList
        visible={showReply}
        title={`公告 ${title} 的评论区`}
        onCancel={() => {
          setShowReply(false);
        }}
        data={comments}
        postUrl={`/announcement/${_id}/comment`}
        onReply={refresh}
      />
    </List.Item>
  );
};
