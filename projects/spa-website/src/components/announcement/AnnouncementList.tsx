import React from "react";
import { Card, List, Spin } from "antd";
import { SingleAnnouncement } from "./SingleAnnouncement";
import { AnnouncementType } from "@/util/enum";
import { useApiRequest } from "@/hook/useApiRequest";

/**
 * @param isInternal {boolean} 是否为内部公告. 若为false则获取外部公告.
 * */
export const AnnouncementList: React.FC<{
  type: AnnouncementType;
}> = ({ type }) => {
  /**
   * 是否显示点赞、评论区.
   * 对外部公告不显示.
   * */
  let showActions = false;

  let path;
  if (type === AnnouncementType.INTERNAL) {
    showActions = true;
    path = `/announcement`;
  } else {
    path = `/custom/announcement`;
  }

  const { code, payload, sendRequest } = useApiRequest({
    path,
    formatResult: (data) => {
      //最近的公告排在前面
      return data.sort((foo: any, bar: any) => {
        if (foo.order === bar.order) {
          return Date.parse(bar.createTime) - Date.parse(foo.createTime);
        }
        return foo.order - bar.order;
      });
    },
    popModal: {
      onFail: true,
      onError: true,
    },
  });

  function handleUpdate() {
    sendRequest();
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
            <SingleAnnouncement
              // id={announceData._id}
              data={announceData}
              refresh={handleUpdate}
              showActions={showActions}
            />
          )}
        />
      )}
    </Card>
  );
};
