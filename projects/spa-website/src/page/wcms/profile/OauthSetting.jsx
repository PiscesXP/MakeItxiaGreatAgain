import React, { useState } from "react";
import { Alert, Button, Col, Modal, Row } from "antd";
import { config } from "CONFIG";
import { useApi } from "HOOK";
import { Loading } from "COMPONENTS/loading";

function OauthSetting() {
  const { loading, isSuccess } = useApi({ path: "/oauth/link/qq" });
  const [showModal, setShowModal] = useState(false);

  function openOAuthWindow() {
    window.open(config.oauth.qq, "_blank");
  }

  function handleClickThisDemo(e) {
    e.preventDefault();
    setShowModal(true);
  }

  if (loading) {
    return <Loading />;
  }
  if (isSuccess) {
    return (
      <Row type="flex" justify="center" align="middle" gutter={[24, 24]}>
        <Col span={16}>
          <Alert
            message="QQ OAuth登录"
            description="已绑定，可以通过QQ登录后台系统😊"
            type="success"
            showIcon
          />
        </Col>
      </Row>
    );
  } else {
    return (
      <div>
        <Row type="flex" justify="center" align="middle" gutter={[24, 24]}>
          <Col span={16}>
            <Alert
              message="QQ OAuth登录"
              description={
                <span>
                  绑定之后，可以通过QQ授权登录(就像
                  <button className="link-button" onClick={handleClickThisDemo}>
                    这样
                  </button>
                  )，无需每次输入账号密码。绑定授权不会泄露你的QQ数据。
                </span>
              }
              type="info"
              showIcon
            />
          </Col>
          <Col span={24}>
            <Row type="flex" justify="center" align="middle">
              <Col>
                <Button type="primary" onClick={openOAuthWindow}>
                  授权QQ登录
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
        <Modal
          visible={showModal}
          title="QQ登录前回样子"
          centered
          onCancel={() => {
            setShowModal(false);
          }}
          footer={null}
        >
          <img
            src="/img/qq-oauth-demo.jpg"
            alt="oauth demo"
            style={{ width: "100%" }}
          />
        </Modal>
      </div>
    );
  }
}

export { OauthSetting };
