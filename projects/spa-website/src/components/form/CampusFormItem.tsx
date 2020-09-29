import React from "react";
import { Form, Select } from "antd";
import { CampusEnum } from "@/util/enum";

export const CampusFormItem: React.FC = () => {
  return (
    <Form.Item
      name="campus"
      label="校区"
      hasFeedback
      rules={[{ required: true, message: "请选择你的校区" }]}
    >
      <Select placeholder="请选择你的校区">
        <Select.Option value={CampusEnum.XIANLIN}>仙林</Select.Option>
        <Select.Option value={CampusEnum.GULOU}>鼓楼</Select.Option>
      </Select>
    </Form.Item>
  );
};
