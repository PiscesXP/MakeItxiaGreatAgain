import React from "react";
/**
 * antd的样式.
 * 放在import前面，避免覆盖自己写的style.
 * */
import "antd/dist/antd.css";
import "./App.css";

import { Main } from "@/page";
import { ConfigProvider } from "antd";
import zhCN from "antd/es/locale/zh_CN";

function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <Main />
    </ConfigProvider>
  );
}

export { App };
