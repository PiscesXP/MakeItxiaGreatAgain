import { Card, Divider } from "antd";
import React from "react";
import { MemberSettings } from "./MemberSettings";
import { PasswordReset } from "./PasswordReset";
import { OauthSetting } from "./OauthSetting";
import { BasicInfo } from "./BasicInfo";
import { useTitleWCMS } from "HOOK";
import { CenterMeResponsive } from "COMPONENTS/layout";

function Profile() {
  useTitleWCMS("个人信息");
  return (
    <CenterMeResponsive small>
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
    </CenterMeResponsive>
  );
}

export { Profile };
