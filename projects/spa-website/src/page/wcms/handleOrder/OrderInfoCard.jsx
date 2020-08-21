import React from "react";
import { Card, Divider, Icon } from "antd";
import * as timeUtil from "UTIL/time";
import { AttachmentList } from "COMPONENTS/attachment";
import { HandleActions } from "./HandleActions";
import { parseEnumValue } from "UTIL/enumParser";
import { MultiLinePlainText } from "COMPONENTS/text";
import { HighlightText } from "COMPONENTS/text/HighlightText";

const getStatusIcon = (status) => {
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
  const { data, whoami, highlightWords, onHandleOrder } = props;
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
    status,
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
        <HighlightText text={name} highlightWords={highlightWords} />
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
        <HighlightText text={phone} highlightWords={highlightWords} />
      </p>
      {email ? (
        <p>
          <strong>邮箱: </strong>
          <HighlightText text={email} highlightWords={highlightWords} />
        </p>
      ) : null}
      <p>
        <strong>电脑型号: </strong>
        <HighlightText text={brandModel} highlightWords={highlightWords} />
      </p>
      <p>
        <strong>操作系统: </strong>
        <HighlightText text={os} highlightWords={highlightWords} />
      </p>
      {warranty ? (
        <p>
          <strong>保修: </strong>
          <HighlightText text={warranty} highlightWords={highlightWords} />
        </p>
      ) : null}
      <p>
        <strong>问题描述: </strong>
      </p>
      <MultiLinePlainText
        content={description}
        highlightWords={highlightWords}
      />
      <br />
      {attachments.length === 0 ? null : (
        <div>
          <p>
            <strong>附件:</strong>
          </p>
          <AttachmentList data={attachments} />
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
