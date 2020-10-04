import React from "react";
import { Form, Select } from "antd";
import { CampusEnum } from "@/util/enum";

interface CampusFormItemProps {
  hasFeedback?: boolean;
  required?: boolean;
}

export const CampusFormItem: React.FC<CampusFormItemProps> = ({
  hasFeedback = true,
  required = true,
}) => {
  return (
    <Form.Item
      name="campus"
      label="校区"
      hasFeedback={hasFeedback}
      required={required}
      rules={[{ required: true, message: "请选择你的校区" }]}
    >
      <Select placeholder="请选择你的校区">
        <Select.Option value={CampusEnum.XIANLIN}>仙林</Select.Option>
        <Select.Option value={CampusEnum.GULOU}>鼓楼</Select.Option>
      </Select>
    </Form.Item>
  );
};
