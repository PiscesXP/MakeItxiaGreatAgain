import React from "react";
import {
  CalendarTwoTone,
  CheckCircleTwoTone,
  ClockCircleTwoTone,
  CloseCircleTwoTone,
  EyeInvisibleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { Card, Divider } from "antd";
import * as timeUtil from "@/util/time";
import { AttachmentList } from "@/components/attachment";
import { HandleActions } from "./HandleActions";
import { parseEnumValue } from "@/util/enum";
import { MultiLinePlainText } from "@/components/text";
import { HighlightText } from "@/components/text/HighlightText";
import { OrderStatusEnum } from "@/util/enum";

const getStatusIcon = (status: OrderStatusEnum) => {
  switch (status) {
    case OrderStatusEnum.PENDING:
      return (
        <CalendarTwoTone twoToneColor="green" className="order-status-icon" />
      );
    case OrderStatusEnum.HANDLING:
      return (
        <ClockCircleTwoTone
          twoToneColor="#66ccff"
          className="order-status-icon"
        />
      );
    case OrderStatusEnum.DONE:
      return <CheckCircleTwoTone className="order-status-icon" />;
    case OrderStatusEnum.CANCELED:
      return (
        <CloseCircleTwoTone twoToneColor="red" className="order-status-icon" />
      );
    default:
  }
};

interface OrderInfoCardProps {
  data: any;
  highlightWords: string[];
  showOrderPrivateInfo: boolean;
  toggleShowOrderPrivateInfo: () => void;
  onHandleOrder: () => void;
}

export const OrderInfoCard: React.FC<OrderInfoCardProps> = ({
  data,
  highlightWords,
  showOrderPrivateInfo,
  toggleShowOrderPrivateInfo,
  onHandleOrder,
}) => {
  const {
    name,
    campus,
    createTime,
    phone,
    email,
    brandModel,
    os,
    qq,
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
        {showOrderPrivateInfo ? (
          <HighlightText text={name} highlightWords={highlightWords} />
        ) : (
          "******"
        )}
        <span
          className="order-private-bottom"
          onClick={toggleShowOrderPrivateInfo}
        >
          {showOrderPrivateInfo ? <EyeInvisibleOutlined /> : <EyeOutlined />}
        </span>
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
        {showOrderPrivateInfo ? (
          <HighlightText text={phone} highlightWords={highlightWords} />
        ) : (
          "********"
        )}
      </p>
      {qq && (
        <p>
          <strong>QQ: </strong>
          {showOrderPrivateInfo ? (
            <HighlightText text={qq} highlightWords={highlightWords} />
          ) : (
            "********"
          )}
        </p>
      )}
      {email ? (
        <p>
          <strong>邮箱: </strong>
          {showOrderPrivateInfo ? (
            <HighlightText text={email} highlightWords={highlightWords} />
          ) : (
            "********"
          )}
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
      <HandleActions data={data} onHandleOrder={onHandleOrder} />
    </Card>
  );
};
