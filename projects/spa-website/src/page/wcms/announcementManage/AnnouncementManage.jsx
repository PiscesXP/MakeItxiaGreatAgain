import React from "react";
import { Card } from "antd";
import { AnnouncementEditor } from "./AnnouncementEditor";
import { CenterMeResponsive } from "COMPONENTS/layout";

function AnnouncementManage() {
  return (
    <CenterMeResponsive>
      <Card title="公告编辑">
        <AnnouncementEditor />
      </Card>
    </CenterMeResponsive>
  );
}

export { AnnouncementManage };
