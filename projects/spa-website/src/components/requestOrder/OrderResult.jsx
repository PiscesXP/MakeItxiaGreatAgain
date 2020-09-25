import React from "react";
import { Alert, Col, Row } from "antd";
import { OrderInfoCard } from "./OrderInfoCard";

function OrderResult(props) {
  const { order } = props;
  const { onCancel, onBackHome } = props;

  const alertPropList = [
    {
      status: "等待处理",
      message: "预约成功",
      description: "请等待IT侠接单.",
      type: "success",
    },
    {
      status: "正在处理",
      message: "正在处理",
      description: "请等待IT侠联系解决问题.",
      type: "info",
    },
    {
      status: "已完成",
      message: "预约已完成",
      type: "success",
    },
  ];

  let alertProps;
  for (const prop of alertPropList) {
    if (prop.status === order.status) {
      alertProps = prop;
    }
  }

  return (
    <Row gutter={[8, 0]} type="flex" justify="center" align="top">
      <Col span={18}>
        <br />
        <Alert {...alertProps} showIcon />
        <br />
        <div className="desc">
          <OrderInfoCard
            data={order}
            onCancel={onCancel}
            onBackHome={onBackHome}
          />
        </div>
      </Col>
    </Row>
  );
}

export { OrderResult };
