import React, { useState } from "react";
import { Alert, Card, Icon } from "antd";
import { OrderInfoCard } from "./OrderInfoCard";
import { CenterMe } from "COMPONENTS/layout";
import { ReplyList } from "COMPONENTS/reply";

function OrderResult(props) {
  const { order } = props;
  const { onCancel, onBackHome, refreshOrderData } = props;

  const [showOrderID, setShowOrderID] = useState(false);

  const [showReply, setShowReply] = useState(false);

  let title = "😶";
  if (showOrderID) {
    title = `预约单ID: ${order._id}`;
  }

  function handleClickEmoji() {
    if (!showOrderID) {
      setShowOrderID(true);
    }
  }

  function handleShowReply() {
    setShowReply(true);
  }

  function handleHideReply() {
    setShowReply(false);
  }

  let alertProps;
  switch (order.status) {
    case "PENDING":
      alertProps = {
        message: "预约成功",
        description: "请等待IT侠接单😊",
        type: "success",
      };
      break;
    case "HANDLING":
      alertProps = {
        message: "正在处理",
        description: `你的单子正由 ${order.handler.realName} 处理中，请等待ta联系解决问题😊`,
        type: "info",
        icon: <Icon type="clock-circle" />,
      };
      break;
    case "DONE":
      alertProps = {
        message: "预约已完成",
        description: `你的单子已由 ${order.handler.realName} 处理完成`,
        type: "success",
      };
      break;
    case "CANCELED":
      alertProps = {
        message: "预约已取消",
        description: `若需要预约请返回主页重新预约`,
        type: "error",
      };
      break;
    default:
  }

  return (
    <Card title="我的预约单">
      <CenterMe>
        <Alert {...alertProps} showIcon />
        <br />
        <div className="desc">
          <OrderInfoCard
            data={order}
            onCancel={onCancel}
            onBackHome={onBackHome}
            onShowReply={handleShowReply}
          />
        </div>
        <span
          onClick={handleClickEmoji}
          style={{ fontSize: "0.2rem", float: "right" }}
        >
          {title}
        </span>
        <ReplyList
          title="给IT侠留言 / 回复消息"
          visible={showReply}
          data={order.reply}
          onCancel={handleHideReply}
          onReply={refreshOrderData}
          postUrl={`/custom/order/${order._id}/reply`}
          anonymousName={`(我)${order.name}`}
        />
      </CenterMe>
    </Card>
  );
}

export { OrderResult };
