import React from "react";
import { Form, Input, Switch } from "antd";
import { RecordTagSelect } from "./RecordTagSelect";

export const SearchCondition: React.FC = () => {
  const [form] = Form.useForm();

  return (
    <Form
      onValuesChange={(values, all) => {
        console.log(all);
      }}
    >
      <Form.Item name="onlyStar" label="只看收藏" valuePropName="checked">
        <Switch />
      </Form.Item>

      <Form.Item name="tags" label="标  签">
        <RecordTagSelect />
      </Form.Item>

      <Form.Item name="text" label="文字搜索">
        <Input allowClear placeholder="标题, 内容..." />
      </Form.Item>
    </Form>
  );
};
