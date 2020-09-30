import React from "react";
import { Form, Radio } from "antd";
import { OrderStatusEnum } from "@/util/enum";

export const OrderStatusFormItem: React.FC = () => {
  return (
    <Form.Item name="status" label="状态">
      <Radio.Group>
        <Radio value="">全部</Radio>
        <Radio value={OrderStatusEnum.PENDING}>等待处理</Radio>
        <Radio value={OrderStatusEnum.HANDLING}>正在处理</Radio>
        <Radio value={OrderStatusEnum.DONE}>已完成</Radio>
        <Radio value={OrderStatusEnum.CANCELED}>已取消</Radio>
      </Radio.Group>
    </Form.Item>
  );
};
