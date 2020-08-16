import React from "react";
import { Card, List, notification, Spin } from "antd";
import { Announcement } from "./Announcement";
import { useApi } from "HOOK";

/**
 * @param isInternal {boolean} 是否为内部公告. 若为false则获取外部公告.
 * */
function AnnouncementList({ isInternal = false }) {
  /**
   * 是否显示点赞、评论区.
   * 对外部公告不显示.
   * */
  let showActions = false;

  let path;
  if (isInternal) {
    showActions = true;
    path = `/announcement`;
  } else {
    path = `/custom/announcement`;
  }

  const { code, payload, send } = useApi({
    path,
    formatResult: (data) => {
      //最近的公告排在前面
      return data.sort((foo, bar) => {
        return Date.parse(bar.createTime) - Date.parse(foo.createTime);
      });
    },
    onError: (error) => {
      notification.error({
        message: "获取公告失败",
        description: error.toString(),
        duration: 0,
      });
    },
  });

  function handleUpdate() {
    send();
  }

  return (
    <Card title="公告栏">
      {code !== 0 ? (
        <Spin />
      ) : (
        <List
          itemLayout="vertical"
          size="default"
          split
          dataSource={payload}
          renderItem={(announceData) => (
            <Announcement
              id={announceData._id}
              data={announceData}
              onUpdate={handleUpdate}
              showActions={showActions}
            />
          )}
        />
      )}
    </Card>
  );
}

export { AnnouncementList };
