import React from "react";
import { List } from "antd";
import { ReactMarkdown } from "@/util/md2html";
import { utcDateToText } from "@/util/time";
import { useMemberContext } from "@/hook/useMemberContext";

export const AnnouncementPreview: React.FC<{
  title: string;
  content: string;
}> = ({ title, content }) => {
  const { realName } = useMemberContext();
  const time = utcDateToText(new Date().toISOString());
  const description = `由 ${realName} 发布于 ${time}`;
  return (
    <List.Item>
      <List.Item.Meta title={title} description={description} />
      <br />
      <ReactMarkdown>{content}</ReactMarkdown>
    </List.Item>
  );
};
