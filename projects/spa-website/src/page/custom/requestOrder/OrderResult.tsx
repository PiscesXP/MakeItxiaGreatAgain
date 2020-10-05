import React, { useState } from "react";
import { ClockCircleOutlined } from "@ant-design/icons";
import { Alert, Card } from "antd";
import { OrderInfoCard } from "./OrderInfoCard";
import { CenterMe } from "@/components/layout";
import { ReplyList } from "@/components/reply";
import { useCustomContext } from "@/page/custom/CustomContext";
import { Redirect } from "react-router-dom";
import { routePath } from "@/page/routePath";
import { Loading } from "@/components/loading";
import { AlertProps } from "antd/es/alert";
import { OrderStatusEnum } from "@/util/enum";

export const OrderResult: React.FC = () => {
  const customContext = useCustomContext();

  const [showOrderID, setShowOrderID] = useState<boolean>(false);

  const [showReply, setShowReply] = useState<boolean>(false);

  if (!customContext.hasOrder()) {
    return <Redirect to={routePath.CUSTOM} />;
  }
  const { order } = customContext;
  if (!order) {
    return <Loading />;
  }

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

  let alertProps: AlertProps = { message: "" };
  switch (order.status as OrderStatusEnum) {
    case OrderStatusEnum.PENDING:
      alertProps = {
        message: "预约成功",
        description: "请等待IT侠接单😊",
        type: "success",
      };
      break;
    case OrderStatusEnum.HANDLING:
      alertProps = {
        message: "正在处理",
        description: `你的单子正由 ${order.handler.realName} 处理中，请等待ta联系解决问题😊`,
        type: "info",
        icon: <ClockCircleOutlined />,
      };
      break;
    case OrderStatusEnum.DONE:
      alertProps = {
        message: "预约已完成",
        description: `你的单子已由 ${order.handler.realName} 处理完成`,
        type: "success",
      };
      break;
    case OrderStatusEnum.CANCELED:
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
          <OrderInfoCard onShowReply={handleShowReply} />
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
          onReply={() => {
            customContext.refreshOrder();
          }}
          postUrl={`/custom/order/${order._id}/reply`}
          anonymousName={`(我)${order.name}`}
        />
      </CenterMe>
    </Card>
  );
};
