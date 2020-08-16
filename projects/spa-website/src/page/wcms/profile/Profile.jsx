import { Card, Col, Divider, Row } from "antd";
import React from "react";
import { MemberSettings } from "./MemberSettings";
import { PasswordReset } from "./PasswordReset";
import { OauthSetting } from "./OauthSetting";
import { BasicInfo } from "./BasicInfo";
import { useTitleWCMS } from "HOOK";

function Profile() {
  useTitleWCMS("个人信息");
  return (
    <Row gutter={[8, 0]} type="flex" justify="center" align="top">
      <Col xs={24} sm={24} md={24} lg={16} xl={12}>
        <Card title="基本信息">
          <BasicInfo />
        </Card>
        <Divider />
        <Card title="个人信息设置">
          <MemberSettings />
        </Card>
        <Divider />
        <Card title="授权登录">
          <OauthSetting />
        </Card>
        <Divider />
        <Card title="重置密码">
          <PasswordReset />
        </Card>
      </Col>
    </Row>
  );
}

export { Profile };
