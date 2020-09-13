import React, { useCallback, useMemo, useState } from "react";
import { Card, Divider, message, Modal, notification } from "antd";
import { AnnouncementEditor } from "./AnnouncementEditor";
import { CenterMeResponsive } from "COMPONENTS/layout";
import { useApi, useTitleWCMS } from "HOOK";
import { AnnouncementTable } from "PAGE/wcms/announcementManage/AnnouncementTable";
import { DELETE, POST, PUT } from "UTIL/api";
import { debounceFn } from "UTIL/common";

function AnnouncementManage() {
  useTitleWCMS("发布公告");

  const { code, loading, payload, mutate, send } = useApi({
    path: "/announcement/all",
  });
  const [editingAnnounceID, setEditingAnnounceID] = useState(null);

  const updateAnnounceOrder = useMemo(() => {
    return debounceFn(async (reorderedData) => {
      const orderData = reorderedData.map((value, index) => {
        return {
          _id: value._id,
          order: index,
        };
      });
      try {
        const result = await PUT("/announcement/all/order", orderData);
        if (result.code === 0) {
          message.success({
            content: "公告排序已更新",
            duration: 2,
          });
        }
      } catch (e) {
        notification.error({
          message: "公告排序未更新",
          description: e.toString(),
        });
      } finally {
        send();
      }
    }, 2500);
  }, [send]);

  const handleReorderAnnounce = useCallback(
    (reorderedData) => {
      mutate(reorderedData);
      updateAnnounceOrder(reorderedData);
    },
    [mutate, updateAnnounceOrder]
  );

  const handleDeleteAnnouncement = useCallback(
    async (aid) => {
      try {
        const deleteResult = await DELETE(`/announcement/${aid}`);
        if (deleteResult.code === 0) {
          Modal.success({
            title: "公告已删除",
            centered: true,
          });
        } else {
          Modal.error({
            title: "公告删除失败",
            content: deleteResult.message,
            centered: true,
          });
        }
      } catch (e) {
        Modal.error({
          title: "操作失败",
          content: e.toString(),
          centered: true,
        });
      } finally {
        send();
      }
    },
    [send]
  );

  const handleStartEditingAnnounce = useCallback((aid) => {
    setEditingAnnounceID(aid);
  }, []);

  /**
   * 处理提交公告.
   * 包含修改、新公告.
   * */
  const handleSubmitAnnouncement = useCallback(
    async (newAnnouncement) => {
      try {
        let submitResult;
        if (!!editingAnnounceID) {
          //修改公告
          submitResult = await PUT(
            `/announcement/${editingAnnounceID}`,
            newAnnouncement
          );
        } else {
          //新公告
          submitResult = await POST("/announcement", newAnnouncement);
        }
        if (submitResult.code === 0) {
          Modal.success({
            title: "发布成功",
            centered: true,
          });
          setEditingAnnounceID(null);
          send();
        } else {
          return Promise.reject(submitResult.message);
        }
      } catch (e) {
        return Promise.reject(e.toString());
      }
    },
    [editingAnnounceID, send]
  );

  return (
    <CenterMeResponsive>
      <Card title="已有公告">
        <AnnouncementTable
          code={code}
          loading={loading}
          data={payload}
          editingAnnounceID={editingAnnounceID}
          onReorderAnnounce={handleReorderAnnounce}
          onDeleteAnnounce={handleDeleteAnnouncement}
          onStartEditingAnnounce={handleStartEditingAnnounce}
        />
      </Card>
      <Divider dashed />
      <Card title="公告编辑">
        <AnnouncementEditor
          editingAnnounceID={editingAnnounceID}
          originAnnounce={
            payload && editingAnnounceID
              ? payload.find((value) => value._id === editingAnnounceID)
              : null
          }
          onSubmitAnnouncement={handleSubmitAnnouncement}
        />
      </Card>
    </CenterMeResponsive>
  );
}

export { AnnouncementManage };
