import React from "react";
import { Card, DatePicker, Form, Input, Radio, Switch } from "antd";
import "./expSearchCondition.css";

/**
 * 筛选条件.
 * */
function ExpSearchConditionForm({ form: { getFieldDecorator } }) {
  return (
    <Card title="筛选">
      <Form className="condition-container">
        <Form.Item label="只看我的">
          {getFieldDecorator("onlyMine", {
            valuePropName: "checked",
            initialValue: false,
          })(<Switch />)}
        </Form.Item>
        <Form.Item label="校区">
          {getFieldDecorator("campus", {
            initialValue: "",
          })(
            <Radio.Group>
              <Radio value="">全部</Radio>
              <Radio value="XIANLIN">仙林</Radio>
              <Radio value="GULOU">鼓楼</Radio>
            </Radio.Group>
          )}
        </Form.Item>
        <Form.Item label="状态">
          {getFieldDecorator("status", {
            initialValue: "",
          })(
            <Radio.Group>
              <Radio value="">全部</Radio>
              <Radio value="PENDING">等待处理</Radio>
              <Radio value="HANDLING">正在处理</Radio>
              <Radio value="DONE">已完成</Radio>
              <Radio value="CANCELED">已取消</Radio>
            </Radio.Group>
          )}
        </Form.Item>
        <Form.Item label="文字搜索">
          {getFieldDecorator("text", {
            initialValue: null,
          })(<Input allowClear placeholder="姓名,电脑型号,问题描述..." />)}
        </Form.Item>
        <Form.Item label="预约时间">
          {getFieldDecorator("orderTime", {
            rules: [
              { type: "array", required: false, message: "请选择时间段" },
            ],
          })(<DatePicker.RangePicker placeholder={["起始日期", "结束日期"]} />)}
        </Form.Item>
      </Form>
    </Card>
  );
}

const ExpSearchCondition = Form.create({
  onFieldsChange: ({ onConditionChange }, changedFields, allFields) => {
    const condition = {};
    for (const fieldKey in allFields) {
      if (
        allFields.hasOwnProperty(fieldKey) &&
        allFields[fieldKey].value !== undefined
      ) {
        condition[fieldKey] = allFields[fieldKey].value;
      }
    }
    onConditionChange(condition);
  },
})(ExpSearchConditionForm);

export { ExpSearchCondition };
