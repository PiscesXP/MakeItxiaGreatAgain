import React from "react";
import { Alert, Button, Card, Col, Row } from "antd";
import { useHistory } from "react-router-dom";
import { routePath } from "PAGE/routePath";
import { useTitleCustom } from "HOOK";
import { CenterMeResponsive } from "COMPONENTS/layout";

function CustomHomePage() {
  useTitleCustom("主页");

  const history = useHistory();

  function handleGoToOrder() {
    window.scrollTo(0, 0);
    history.push(routePath.custom.ORDER);
  }

  function handleRetrieveOrder() {
    history.push(routePath.custom.RETRIEVE);
  }

  const orderID = window.localStorage.getItem("requestedOrderId");

  let orderButtonText = "发起预约";
  if (orderID) {
    orderButtonText = "查看我的预约";
  }

  const orderNotification = (
    <ul style={{ margin: "0.5em" }}>
      {!!!orderID ? (
        <li>
          已有预约？
          <Button
            type="link"
            style={{ height: 0, padding: 0 }}
            onClick={handleRetrieveOrder}
          >
            找回预约单
          </Button>
        </li>
      ) : null}
      <li>
        预约之前，请查看我们的
        <a
          rel="noopener noreferrer"
          href="https://itxia.club/service#TOS"
          target="_blank"
        >
          服务条款
        </a>
      </li>
      <li>
        加入
        <a
          rel="noopener noreferrer"
          href="https://itxia.club/service#groups"
          target="_blank"
        >
          IT侠互助QQ群
        </a>
        在线寻找帮助
      </li>
    </ul>
  );

  return (
    <Card title="预约维修">
      <Row gutter={[8, 24]} type="flex" justify="center" align="top">
        <Col span={24} style={{ display: "flex", justifyContent: "center" }}>
          <img
            src="/img/itxia-logo.jpg"
            alt="logo"
            style={{ display: "block" }}
          />
        </Col>
        <Col span={24} style={{ display: "flex", justifyContent: "center" }}>
          <Button type="primary" onClick={handleGoToOrder}>
            {orderButtonText}
          </Button>
        </Col>
        <Col span={24}>
          <CenterMeResponsive>
            <Alert type="info" message={orderNotification} />
          </CenterMeResponsive>
        </Col>
      </Row>
    </Card>
  );
}

export { CustomHomePage };
