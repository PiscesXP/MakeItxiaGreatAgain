import { Divider } from "antd";
import React from "react";
import { AnnouncementList } from "COMPONENTS/announcement";
import { OrderStat } from "./OrderStat";
import { MyOrderStat } from "./MyOrderStat";
import { useTitleWCMS } from "HOOK";
import "./index.css";

function DashBoard() {
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
        <AnnouncementList isInternal={true} />
        <Divider />
      </div>
    </div>
  );
}

export { DashBoard };
