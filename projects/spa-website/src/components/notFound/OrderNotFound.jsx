import { NotFound } from "./NotFound";
import React from "react";

function OrderNotFound() {
  return (
    <NotFound
      title="什么都没找到"
      subTitle="试试换个筛选条件"
      icon={<img src="/img/lanshou.png" alt="蓝受" />}
      extra={null}
    />
  );
}

export { OrderNotFound };
