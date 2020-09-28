import React from "react";
import { Card, DatePicker, Form, Input, Radio, Switch } from "antd";
import moment from "moment";

interface SearchConditionProps {
  initialValues: any;
  onConditionChange: (values: any) => void;
}

/**
 * 筛选条件.
 * */
export const SearchCondition: React.FC<SearchConditionProps> = ({
  initialValues,
  onConditionChange,
}) => {
  if (Array.isArray(initialValues?.orderTime)) {
    initialValues.orderTime = initialValues.orderTime.map((date: any) => {
      console.log(date);
      return moment(date);
    });
  }

  function onValuesChange(changedValues: any, values: any) {
    onConditionChange(values);
  }

  // noinspection NonAsciiCharacters
  return (
    <Card title="筛选">
      <Form
        initialValues={initialValues}
        onValuesChange={onValuesChange}
        className="condition-container"
      >
        <Form.Item name="onlyMine" label="只看我的" valuePropName="checked">
          <Switch />
        </Form.Item>
        <Form.Item name="campus" label="校区">
          <Radio.Group>
            <Radio value="">全部</Radio>
            <Radio value="XIANLIN">仙林</Radio>
            <Radio value="GULOU">鼓楼</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item name="status" label="状态">
          <Radio.Group>
            <Radio value="">全部</Radio>
            <Radio value="PENDING">等待处理</Radio>
            <Radio value="HANDLING">正在处理</Radio>
            <Radio value="DONE">已完成</Radio>
            <Radio value="CANCELED">已取消</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item name="text" label="文字搜索">
          <Input allowClear placeholder="姓名,电脑型号,问题描述..." />
        </Form.Item>
        <Form.Item name="orderTime" label="预约时间">
          <DatePicker.RangePicker
            ranges={{
              今天: [moment(), moment()],
              本周: [moment().startOf("week"), moment().endOf("week")],
              本月: [moment().startOf("month"), moment().endOf("month")],
            }}
            disabledDate={(date) => {
              return date.isAfter(moment());
            }}
            //@ts-ignore
            defaultValue={[undefined, moment()]}
          />
        </Form.Item>
      </Form>
    </Card>
  );
};
