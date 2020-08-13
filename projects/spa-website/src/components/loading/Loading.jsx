import { Spin } from "antd";
import React from "react";
import "./loading.css";

function Loading(props) {
  const { tip = "加载中...", delay = 500 } = props;
  return (
    <div className="loading">
      <Spin tip={tip} delay={delay}></Spin>
    </div>
  );
}

export { Loading };
