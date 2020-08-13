import React from "react";
import { List } from "antd";
import { ReactMarkdown } from "UTIL/md2html";
import { useMemberContext } from "HOOK";
import { utcDateToText } from "UTIL/time";

function AnnouncementPreview({ title, content }) {
  const { realName } = useMemberContext();
  const time = utcDateToText(new Date().toISOString());
  const description = `由 ${realName} 发布于 ${time}`;
  return (
    <List.Item>
      <List.Item.Meta title={title} description={description} />
      <br />
      <ReactMarkdown source={content} />
    </List.Item>
  );
}
export { AnnouncementPreview };
