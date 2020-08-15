import React from "react";
import { Col, Row } from "antd";

function CenterMe(props) {
  return (
    <Row gutter={[8, 0]} type="flex" justify="center" align="top">
      <Col span={24}>{props.children}</Col>
    </Row>
  );
}

function CenterMeResponsive(props) {
  return (
    <Row gutter={[8, 0]} type="flex" justify="center" align="top">
      <Col xs={24} sm={24} md={22} lg={20} xl={17} xxl={14}>
        {props.children}
      </Col>
    </Row>
  );
}
export { CenterMe, CenterMeResponsive };
