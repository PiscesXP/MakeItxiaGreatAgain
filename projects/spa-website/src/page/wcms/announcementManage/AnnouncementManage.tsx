import React, { useState } from "react";
import { Card, Divider, message, notification } from "antd";
import { AnnouncementEditor } from "./AnnouncementEditor";
import { CenterMeResponsive } from "@/components/layout";
import { AnnouncementTable } from "./AnnouncementTable";
import { DELETE, POST, PUT } from "@/request/api";
import { useTitleWCMS } from "@/hook/useTitle";
import { useApiRequest } from "@/hook/useApiRequest";
import { useDebounce } from "@/hook/useDebounce";
import { ApiRequestStateEnum } from "@/request/types";
import { usePersistFn } from "@/hook/usePersisFn";
import { popModalOnApiResult } from "@/util/modalUtil";

export const AnnouncementManage: React.FC = () => {
  useTitleWCMS("发布公告");

  const announcementApiRequest = useApiRequest({
    path: "/announcement/all",
  });

  const [editingAnnounceID, setEditingAnnounceID] = useState<string | null>(
    null
  );

  const updateAnnounceOrder = useDebounce(async (reorderedData: any[]) => {
    const orderData = reorderedData.map((value, index) => {
      return {
        _id: value._id,
        order: index,
      };
    });
    const result = await PUT("/announcement/all/order", orderData);
    if (result.state === ApiRequestStateEnum.success) {
      message.success({
        content: "公告排序已更新",
        duration: 2,
      });
    } else {
      notification.error({
        message: "公告排序未更新",
      });
    }
    //刷新数据
    announcementApiRequest.sendRequest();
  }, 2000);

  const handleReorderAnnounce = usePersistFn((orderChangedData) => {
    announcementApiRequest.mutate(orderChangedData);
    updateAnnounceOrder(orderChangedData);
  });

  const handleDeleteAnnouncement = usePersistFn(async (announceID) => {
    const result = await DELETE(`/announcement/${announceID}`);
    popModalOnApiResult({
      result,
      onSuccess: {
        title: "公告已删除",
      },
      onFail: {
        title: "公告删除失败",
      },
      onError: true,
    });
    //刷新数据
    announcementApiRequest.sendRequest();
  });

  const handleStartEditingAnnounce = usePersistFn((announceID) => {
    setEditingAnnounceID(announceID);
  });

  /**
   * 处理提交公告.
   * 包含修改、新公告.
   * */
  const handleSubmitAnnouncement = usePersistFn(async (newAnnouncement) => {
    let result;
    if (!!editingAnnounceID) {
      //修改公告
      result = await PUT(`/announcement/${editingAnnounceID}`, newAnnouncement);
    } else {
      //新公告
      result = await POST("/announcement", newAnnouncement);
    }
    popModalOnApiResult({
      result,
      onSuccess: {
        title: "发布成功",
      },
      onFail: true,
      onError: true,
    });
    if (result.state === ApiRequestStateEnum.success) {
      setEditingAnnounceID(null);
      announcementApiRequest.sendRequest();
    }
    return result;
  });

  const { payload, loading } = announcementApiRequest;

  return (
    <CenterMeResponsive>
      <Card title="已有公告">
        <AnnouncementTable
          loading={loading}
          data={payload}
          editingAnnounceID={editingAnnounceID}
          onChangeAnnounceOrder={handleReorderAnnounce}
          onDeleteAnnounce={handleDeleteAnnouncement}
          onEditAnnounce={handleStartEditingAnnounce}
        />
      </Card>
      <Divider dashed />
      <Card title="公告编辑">
        <AnnouncementEditor
          editingAnnounceID={editingAnnounceID}
          originAnnounce={
            payload && editingAnnounceID
              ? payload.find((value: any) => value._id === editingAnnounceID)
              : null
          }
          onSubmitAnnouncement={handleSubmitAnnouncement}
        />
      </Card>
    </CenterMeResponsive>
  );
};
