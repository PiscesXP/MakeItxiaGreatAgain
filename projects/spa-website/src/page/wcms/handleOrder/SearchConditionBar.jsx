import React, { useEffect } from "react";
import { useMemberContext } from "HOOK";
import PropTypes from "prop-types";
import { Card, Checkbox, Col, Form, Radio, Row, Switch } from "antd";
import { buildQueryString, parseQueryString } from "UTIL/query";

/**
 * 筛选条件.
 * */
function SearchConditionBarRender(props) {
  const { getFieldDecorator, setFieldsValue } = props.form;

  const context = useMemberContext();

  useEffect(() => {
    const defaultCondition = {
      onlyMine: false,
      campus: context["campus"],
      status: ["PENDING", "HANDLING"]
    };
    //第一次加载时，从querystring解析出筛选条件
    const qsCondition = parseQueryString((value, key) => {
      switch (key) {
        case "onlyMine":
          return Boolean(value);
        case "campus":
          return value;
        case "status":
          return value.split(",");
        default:
          return value;
      }
    });
    Object.assign(defaultCondition, qsCondition);
    setFieldsValue(defaultCondition);
  }, [context, setFieldsValue]);

  return (
    <Card title="筛选">
      <Form>
        <Row gutter={24} id="sb-form-item-container">
          <Form.Item label="只看我的">
            {getFieldDecorator("onlyMine", {
              valuePropName: "checked",
              initialValue: false
            })(<Switch />)}
          </Form.Item>
          <Form.Item label="校区">
            {getFieldDecorator("campus", {
              initialValue: ""
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
              initialValue: ["PENDING", "HANDLING"]
            })(
              <Checkbox.Group style={{ width: "100%" }}>
                <Row>
                  <Col span={12}>
                    <Checkbox value="PENDING">等待处理</Checkbox>
                  </Col>
                  <Col span={12}>
                    <Checkbox value="HANDLING">正在处理</Checkbox>
                  </Col>
                  <Col span={12}>
                    <Checkbox value="DONE">已完成</Checkbox>
                  </Col>
                  <Col span={12}>
                    <Checkbox value="CANCELED">已取消</Checkbox>
                  </Col>
                </Row>
              </Checkbox.Group>
            )}
          </Form.Item>
        </Row>
      </Form>
    </Card>
  );
}

const SearchConditionBar = Form.create({
  onFieldsChange: (props, changedFields, allFields) => {
    //根据筛选条件改变query string
    const condition = {};
    for (const fieldName in allFields) {
      if (allFields.hasOwnProperty(fieldName)) {
        condition[fieldName] = allFields[fieldName].value;
      }
    }
    const qs = buildQueryString(condition);
    const newUrl = window.location.toString().split("?")[0] + qs;
    //TODO 防抖处理
    setTimeout(() => {
      window.history.pushState(null, null, newUrl);
      props.onConditionChange(condition);
    }, 1000);
  }
})(SearchConditionBarRender);

SearchConditionBar.propTypes = {
  onConditionChange: PropTypes.func.isRequired
};

export { SearchConditionBar };
