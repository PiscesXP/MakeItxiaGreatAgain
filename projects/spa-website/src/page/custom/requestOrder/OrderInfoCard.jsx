import React from "react";
import { Button, Card, Col, Divider, Icon, Popconfirm, Row } from "antd";
import * as timeUtil from "UTIL/time";
import { Attachment } from "COMPONENTS/attachment";
import { ReactMarkdown } from "UTIL/md2html";

const getStatusIcon = status => {
  switch (status) {
    case "等待处理":
      return (
        <Icon
          type="calendar"
          theme="twoTone"
          twoToneColor="green"
          style={{ fontSize: "1.5em" }}
        />
      );
    case "正在处理":
      return (
        <Icon
          type="clock-circle"
          theme="twoTone"
          twoToneColor="#66ccff"
          style={{ fontSize: "1.5em" }}
        />
      );
    case "已完成":
      return (
        <Icon
          type="check-circle"
          theme="twoTone"
          style={{ fontSize: "1.5em" }}
        />
      );
    case "已取消":
      return (
        <Icon
          type="close-circle"
          theme="twoTone"
          twoToneColor="red"
          style={{ fontSize: "1.5em" }}
        />
      );
    default:
  }
};

function OrderInfoCard(props) {
  const { data } = props;
  const {
    name,
    campus,
    createTime,
    phone,
    email,
    qq,
    brandModel,
    os,
    warranty,
    description,
    attachments,
    status
  } = data;

  const { onCancel, onBackHome } = props;

  return (
    <Card className="order-card">
      <span style={{ fontSize: "1.3em" }}>
        {getStatusIcon(status)}
        {"   "}
        <span style={{ margin: "0 0 5px 0" }}>{status}</span>
      </span>
      <br />
      <Divider dashed className="order-hr" />
      <p>
        <strong>姓名: </strong>
        {name}
      </p>
      <p>
        <strong>校区: </strong>
        {campus}
      </p>
      <p>
        <strong>电话: </strong>
        {phone}
      </p>
      <p>
        <strong>QQ: </strong>
        {qq}
      </p>
      <p>
        <strong>邮箱: </strong>
        {email}
      </p>
      <p>
        <strong>电脑型号: </strong>
        {brandModel}
      </p>
      <p>
        <strong>操作系统: </strong>
        {os}
      </p>
      <p>
        <strong>保修状况: </strong>
        {warranty}
      </p>
      <p>
        <strong>预约时间: </strong>
        {timeUtil.utcDateToText(createTime)}
      </p>
      <p>
        <strong>问题描述: </strong>
      </p>
      <div className="order-card-desc">
        <ReactMarkdown source={description} />
      </div>
      <br />
      {attachments.length === 0 ? null : (
        <div>
          <p>
            <strong>附件:</strong>
          </p>
          {attachments.map(value => {
            return <Attachment key={value._id} data={value} />;
          })}
        </div>
      )}
      <Divider dashed className="order-hr" />
      <Row gutter={[8, 0]} type="flex" justify="center" align="top">
        <Col span={6}>
          {status === "等待处理" ? (
            <Popconfirm
              title="确定要取消吗?"
              okText="确定"
              cancelText="不了"
              onConfirm={onCancel}
            >
              <Button type="danger">取消预约</Button>
            </Popconfirm>
          ) : null}
          {status === "已完成" ? (
            <Button onClick={onBackHome}>返回主页</Button>
          ) : null}
        </Col>
      </Row>
    </Card>
  );
}

export { OrderInfoCard };
