import React from "react";
import { Card, Divider, Icon } from "antd";
import * as timeUtil from "UTIL/time";
import { Attachment } from "COMPONENTS/attachment";
import { HandleActions } from "./HandleActions";
import { ReactMarkdown } from "UTIL/md2html";
import { parseEnumValue } from "UTIL/enumParser";

const getStatusIcon = status => {
  switch (status) {
    case "PENDING":
      return (
        <Icon
          type="calendar"
          theme="twoTone"
          twoToneColor="green"
          style={{ fontSize: "1.5em" }}
        />
      );
    case "HANDLING":
      return (
        <Icon
          type="clock-circle"
          theme="twoTone"
          twoToneColor="#66ccff"
          style={{ fontSize: "1.5em" }}
        />
      );
    case "DONE":
      return (
        <Icon
          type="check-circle"
          theme="twoTone"
          style={{ fontSize: "1.5em" }}
        />
      );
    case "CANCELED":
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
  const { data, whoami, onHandleOrder } = props;
  const {
    name,
    campus,
    createTime,
    phone,
    email,
    brandModel,
    os,
    warranty,
    description,
    attachments,
    status
  } = data;
  return (
    <Card className="order-card">
      <span style={{ fontSize: "1.3em" }}>
        {getStatusIcon(status)}
        {"   "}
        <span style={{ margin: "0 0 5px 0" }}>{parseEnumValue(status)}</span>
      </span>
      <br />
      <Divider dashed className="order-hr" />
      <p>
        <strong>姓名: </strong>
        {name}
      </p>
      <p>
        <strong>校区: </strong>
        {parseEnumValue(campus)}
      </p>
      <p>
        <strong>预约时间: </strong>
        {timeUtil.utcDateToText(createTime)}
      </p>
      <p>
        <strong>电话: </strong>
        {phone}
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
      {warranty ? (
        <p>
          <strong>保修: </strong>
          {warranty}
        </p>
      ) : null}
      <p>
        <strong>问题描述: </strong>
      </p>
      <div className="order-card-desc">
        <ReactMarkdown
          escapeHtml
          source={description.replace(/<br \/>/g, "\r\n")}
        />
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
      <HandleActions
        data={data}
        whoami={whoami}
        onHandleOrder={onHandleOrder}
      />
    </Card>
  );
}

export { OrderInfoCard };
