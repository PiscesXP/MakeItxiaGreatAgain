import React from "react";
import { Button, Descriptions, Popconfirm } from "antd";
import { AttachmentList } from "@/components/attachment";
import { parseEnumValue } from "@/util/enum";
import { utcDateToText } from "@/util/time";
import { MultiLinePlainText } from "@/components/text";
import { useCustomContext } from "@/page/custom/CustomContext";
import { Redirect, useHistory } from "react-router-dom";
import { routePath } from "@/page/routePath";
import { Loading } from "@/components/loading";
import { useApiRequest } from "@/hook/useApiRequest";
import { OrderStatusEnum } from "@/util/enum";

const { Item } = Descriptions;

export const OrderInfoCard: React.FC<{
  onShowReply: () => void;
}> = ({ onShowReply }) => {
  const { hasOrder, order, orderID, resetOrder } = useCustomContext();

  const history = useHistory();

  const cancelApiRequest = useApiRequest({
    path: `/custom/order/${orderID}/cancel`,
    method: "PUT",
    manual: true,
    popModal: {
      onSuccess: {
        title: "取消成功",
        content: "预约已取消",
        onOk: () => {
          resetOrder();
          history.push(routePath.CUSTOM);
        },
      },
      onFail: {
        title: "取消失败",
        content: "请刷新查看预约单状态 (可能已经被接单)",
      },
      onError: true,
    },
  });

  if (!hasOrder()) {
    return <Redirect to={routePath.CUSTOM} />;
  }
  if (!order) {
    return <Loading />;
  }

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
  } = order;

  const status: OrderStatusEnum = order.status;

  function onCancel() {
    cancelApiRequest.sendRequest();
  }

  function onBackHome() {
    history.replace(routePath.CUSTOM);
    resetOrder();
  }

  return (
    <Descriptions bordered column={1}>
      <Item label="姓名">{name}</Item>
      <Item label="校区">{parseEnumValue(campus)}</Item>
      <Item label="电话">{phone}</Item>
      <Item label="QQ">{qq}</Item>
      <Item label="邮箱">{email}</Item>
      <Item label="电脑型号">{brandModel}</Item>
      <Item label="操作系统">{os}</Item>
      <Item label="保修状况">{warranty}</Item>
      <Item label="预约时间">{utcDateToText(createTime)}</Item>
      <Item label="问题描述">
        <MultiLinePlainText content={description} />
      </Item>
      <Item label="附件">
        {attachments.length === 0 ? (
          "无"
        ) : (
          <AttachmentList data={attachments} />
        )}
      </Item>
      <Item label="操作">
        {(status === OrderStatusEnum.PENDING ||
          status === OrderStatusEnum.HANDLING) && (
          <Button
            type="primary"
            onClick={onShowReply}
            style={{ marginRight: "16px" }}
          >{`回复消息(${order.reply.length}条)`}</Button>
        )}
        {status === OrderStatusEnum.PENDING && (
          <Popconfirm
            title="确定要取消吗?"
            okText="确定"
            cancelText="不了"
            onConfirm={onCancel}
          >
            <Button type="primary" danger>
              取消预约
            </Button>
          </Popconfirm>
        )}
        {status === OrderStatusEnum.DONE && (
          <Button type="primary" onClick={onBackHome}>
            返回主页
          </Button>
        )}
        {status === OrderStatusEnum.CANCELED && (
          <Button type="primary" onClick={onBackHome}>
            返回主页 / 重新预约
          </Button>
        )}
        {status === OrderStatusEnum.HANDLING && "预约单处理中..."}
      </Item>
    </Descriptions>
  );
};
