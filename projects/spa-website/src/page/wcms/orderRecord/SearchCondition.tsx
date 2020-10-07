import React from "react";
import { Form, Input, Switch } from "antd";
import { RecordTagSelect } from "./RecordTagSelect";

interface SearchConditionProps {
  onConditionChange: (values: any) => void;
}

export const SearchCondition: React.FC<SearchConditionProps> = ({
  onConditionChange,
}) => {
  return (
    <Form
      onValuesChange={(changedValues, allValues) => {
        onConditionChange(allValues);
      }}
      labelCol={{ span: 5 }}
    >
      <Form.Item name="tags" label="标签">
        <RecordTagSelect />
      </Form.Item>

      <Form.Item name="text" label="文字搜索">
        <Input allowClear placeholder="标题, 内容..." />
      </Form.Item>
      <Form.Item name="onlyStar" label="只看收藏" valuePropName="checked">
        <Switch />
      </Form.Item>
    </Form>
  );
};
