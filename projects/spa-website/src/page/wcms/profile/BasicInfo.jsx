import React from "react";
import { Descriptions } from "antd";
import { parseEnumValue } from "UTIL/enumParser";
import { useMemberContext } from "HOOK";

const { Item } = Descriptions;

/**
 * 个人基本信息.
 */
function BasicInfo() {
  const { realName, loginName, _id, role } = useMemberContext();
  return (
    <Descriptions column={1} bordered>
      <Item label="姓名">{realName}</Item>
      <Item label="登录账号">{loginName}</Item>
      <Item label="账号身份">{parseEnumValue(role)}</Item>
      <Item label="系统ID">{_id}</Item>
    </Descriptions>
  );
}

export { BasicInfo };
