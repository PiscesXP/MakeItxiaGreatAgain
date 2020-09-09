import React from "react";
import { Result } from "antd";

function OrderNotFound() {
  return (
    <Result
      title="什么都没找到"
      subTitle="试试换个筛选条件"
      icon={<img src="/img/lanshou.png" alt="蓝受" />}
      extra={null}
    />
  );
}

export { OrderNotFound };
