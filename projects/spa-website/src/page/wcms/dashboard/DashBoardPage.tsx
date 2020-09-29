import { Divider } from "antd";
import React from "react";
import { AnnouncementList } from "@/components/announcement";
import { OrderStat } from "./OrderStat";
import { MyOrderStat } from "./MyOrderStat";
import { AnnouncementType } from "@/util/enum";
import { useTitleWCMS } from "@/hook/useTitle";
import "./index.css";

export const DashBoardPage = () => {
  useTitleWCMS("DashBoard");
  return (
    <div id="dash-container">
      <div id="dash-stat">
        <OrderStat />
        <Divider />
        <MyOrderStat />
      </div>
      <div id="dash-space" />
      <div id="dash-anno">
        <AnnouncementList type={AnnouncementType.INTERNAL} />
        <Divider />
      </div>
    </div>
  );
};
