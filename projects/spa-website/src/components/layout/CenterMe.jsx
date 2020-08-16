import React from "react";
import { Col, Row } from "antd";
import "./index.css";

function CenterMe(props) {
  return (
    <Row gutter={[8, 0]} type="flex" justify="center" align="top">
      <Col span={24}>{props.children}</Col>
    </Row>
  );
}

function CenterMeFlex({ children }) {
  return <div className="center-me-flex">{children}</div>;
}

/**
 * @param small {boolean}
 * @param children
 * */
function CenterMeResponsive({ small, children }) {
  const normalLayout = {
    xs: 24,
    sm: 24,
    md: 22,
    lg: 20,
    xl: 17,
    xxl: 14,
  };

  const smallLayout = {
    xs: 24,
    sm: 22,
    md: 19,
    lg: 16,
    xl: 14,
    xxl: 12,
  };

  let colLayout = normalLayout;

  if (small) {
    colLayout = smallLayout;
  }

  return (
    <Row gutter={[8, 0]} type="flex" justify="center" align="top">
      <Col {...colLayout}>{children}</Col>
    </Row>
  );
}
export { CenterMe, CenterMeFlex, CenterMeResponsive };
