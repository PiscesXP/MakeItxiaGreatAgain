import React from "react";
import { Card } from "antd";
import { AnnouncementEditor } from "./AnnouncementEditor";
import { CenterMeResponsive } from "COMPONENTS/layout";
import { useTitleWCMS } from "HOOK";

function AnnouncementManage() {
  useTitleWCMS("发布公告");
  return (
    <CenterMeResponsive>
      <Card title="公告编辑">
        <AnnouncementEditor />
      </Card>
    </CenterMeResponsive>
  );
}

export { AnnouncementManage };
