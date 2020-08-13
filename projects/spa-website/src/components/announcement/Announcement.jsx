import React, { useContext, useState } from "react";
import { Icon, List } from "antd";
import { Attachment } from "COMPONENTS/attachment";
import { ReplyList } from "COMPONENTS/reply";
import * as timeUtil from "UTIL/time";
import { ReactMarkdown } from "UTIL/md2html";
import { UserInfoContext } from "CONTEXT/UserInfo";
import * as api from "UTIL/api";

/**
 * 单个公告展示.
 */
function Announcement(props) {
  const { data, handleUpdate, showActions } = props;
  const {
    _id,
    title,
    content,
    attachments,
    createTime,
    postBy,
    likedBy,
    comments
  } = data;

  const [showReply, setShowReply] = useState(false);

  const userInfoContext = useContext(UserInfoContext);

  //是否已点赞
  const isLiked =
    likedBy.findIndex(likedBy => {
      return likedBy._id === userInfoContext._id;
    }) !== -1;

  async function hitLikeButton() {
    try {
      await api.PUT(`/announcement/${_id}/${isLiked ? "unlike" : "like"}`);
      handleUpdate();
    } catch (error) {
      //TODO
    }
  }

  return (
    <List.Item
      actions={
        showActions
          ? [
              <span key="1" onClick={hitLikeButton}>
                <Icon
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
                <Icon type="message" style={{ marginRight: 8 }} />
                {comments.length}
              </span>
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
      <ReactMarkdown source={content}></ReactMarkdown>
      <br />
      {attachments.map(value => {
        return <Attachment key={value._id} data={value} />;
      })}
      <ReplyList
        visible={showReply}
        title={`公告 ${title} 的评论区`}
        onCancel={() => {
          setShowReply(false);
        }}
        data={comments}
        postUrl={`/announcement/${_id}/comment`}
        onReply={() => {
          handleUpdate();
        }}
      />
    </List.Item>
  );
}

export { Announcement };
