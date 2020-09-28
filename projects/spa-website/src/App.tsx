import React from "react";
/**
 * antd的样式.
 * 放在import前面，避免覆盖自己写的style.
 * */
import "antd/dist/antd.css";
import "./App.css";

import { ConfigProvider } from "antd";
import zhCN from "antd/es/locale/zh_CN";
import moment from "moment";
import "moment/locale/zh-cn";
import { Main } from "@/page";

function App() {
  moment.locale("zh-cn");
  return (
    <ConfigProvider locale={zhCN}>
      <Main />
    </ConfigProvider>
  );
}

export { App };
