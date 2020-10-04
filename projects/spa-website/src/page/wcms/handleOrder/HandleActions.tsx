import React, { useState } from "react";
import { Alert, Button, Popconfirm } from "antd";
import { PUT } from "@/request/api";
import { ReplyList } from "@/components/reply";
import { useMemberContext } from "@/hook/useMemberContext";
import { MemberRoleEnum, OrderStatusEnum } from "@/util/enum";
import { popModalOnApiResult } from "@/util/modalUtil";

interface HandleActionsProps {
  data: any;
  onHandleOrder: () => void;
}

interface ActionList {
  accept: boolean; //自己可以接单
  giveup: boolean;
  done: boolean;
  delete: boolean;
  acceptByOther: boolean; //别的人接了单
  doneByOther: boolean;
  canceled: boolean;
  deleted: boolean;
  discuss: boolean; //评论区
}

// eslint-disable-next-line no-shadow
enum OrderHandleType {
  accept = "accept",
  giveup = "giveup",
  done = "done",
  delete = "delete",
}

/**
 * 显示预约单卡片底下的按钮.(接单/放回...)
 */
export const HandleActions: React.FC<HandleActionsProps> = (props) => {
  const userInfoContext = useMemberContext();
  const { _id: currentItxiaID, role } = userInfoContext; //当前登录用户的id

  const { data, onHandleOrder } = props;
  const {
    _id,
    name,
    acceptEmailNotification,
    status,
    handler,
    discuss,
    reply,
  } = data;

  const isMyOrder = handler && currentItxiaID === handler._id; //是否是自己的预约单

  //决定显示哪些按钮/提示框
  const showList: ActionList = {
    accept: false, //自己可以接单
    giveup: false,
    done: false,
    delete: false,
    acceptByOther: false,
    doneByOther: false,
    canceled: false,
    deleted: false,
    discuss: false,
  };

  switch (status as OrderStatusEnum) {
    case OrderStatusEnum.PENDING:
      showList.accept = true;
      showList.delete = true;
      break;
    case OrderStatusEnum.HANDLING:
      showList.delete = true;
      if (isMyOrder) {
        showList.giveup = true;
        showList.done = true;
      } else {
        showList.acceptByOther = true;
      }
      break;
    case OrderStatusEnum.DONE:
      showList.doneByOther = true;
      //TODO done by me?
      break;
    case OrderStatusEnum.CANCELED:
      showList.canceled = true;
      break;
  }

  //非管理员不显示删除按钮
  if (role !== MemberRoleEnum.ADMIN && role !== MemberRoleEnum.SUPER_ADMIN) {
    showList.delete = false;
  }

  //正在进行中的操作类型. 用于把对应按钮显示为loading
  const [handleType, setHandleType] = useState<OrderHandleType | null>(null);

  /**
   * 提交更改.(接单/放回...)
   */
  const onSubmit = (actionType: OrderHandleType) => async () => {
    setHandleType(actionType);
    const result = await PUT(`/order/${_id}/deal/${actionType}`);
    //可以改成表驱动
    let actionName;
    switch (actionType) {
      case OrderHandleType.accept:
        actionName = "接受";
        break;
      case OrderHandleType.done:
        actionName = "完成";
        break;
      case OrderHandleType.giveup:
        actionName = "放回";
        break;
      case OrderHandleType.delete:
        actionName = "删除";
        break;
      default:
    }
    //弹出提示框
    popModalOnApiResult({
      result,
      onSuccess: {
        title: "操作成功",
        content: `预约单已成功${actionName}.`,
        onOk: () => {
          onHandleOrder();
        },
      },
      onFail: {
        title: "操作失败",
        content: "请刷新后重试.(可能预约单已被接受或取消)",
      },
      onError: true,
    });
    setHandleType(null);
  };

  const [showDiscuss, setShowDiscuss] = useState<boolean>(false);
  const [showReply, setShowReply] = useState<boolean>(false);

  const discussCount = discuss.length;

  let showSendEmailCheckbox = acceptEmailNotification === true;

  return (
    <div className="order-btn-container">
      {status === "PENDING" || status === "HANDLING" ? (
        <Button
          onClick={() => {
            setShowReply(true);
          }}
        >
          回复消息 ({reply.length}条)
        </Button>
      ) : null}
      <Button
        onClick={() => {
          setShowDiscuss(true);
        }}
      >
        讨论区 ({discussCount}条)
      </Button>
      {showList.accept && (
        <Popconfirm
          title="确定要接单吗?"
          okText="确定"
          cancelText="取消"
          onConfirm={onSubmit(OrderHandleType.accept)}
        >
          <Button
            type="primary"
            loading={handleType === OrderHandleType.accept}
          >
            我来处理
          </Button>
        </Popconfirm>
      )}
      {showList.giveup && (
        <Popconfirm
          title="确定要放回吗?"
          okText="确定"
          cancelText="取消"
          onConfirm={onSubmit(OrderHandleType.giveup)}
        >
          <Button loading={handleType === OrderHandleType.giveup}>放回</Button>
        </Popconfirm>
      )}
      {showList.done && (
        <Popconfirm
          title="确定完成预约单了吗?"
          okText="确定"
          cancelText="取消"
          onConfirm={onSubmit(OrderHandleType.done)}
        >
          <Button type="primary" loading={handleType === OrderHandleType.done}>
            完成
          </Button>
        </Popconfirm>
      )}
      {showList.delete && (
        <Popconfirm
          title="确定要移到废纸篓吗?"
          okText="确定"
          cancelText="取消"
          onConfirm={onSubmit(OrderHandleType.delete)}
        >
          <Button
            type="primary"
            danger
            loading={handleType === OrderHandleType.delete}
          >
            废纸篓
          </Button>
        </Popconfirm>
      )}
      {showList.acceptByOther && (
        <Alert
          type="info"
          message={
            <span>
              正由 <strong>{handler && handler.realName}</strong> 处理中.
            </span>
          }
        />
      )}
      {showList.doneByOther && (
        <Alert
          type="success"
          message={
            <span>
              已由 <strong>{handler.realName}</strong> 处理完成.
            </span>
          }
        />
      )}
      {showList.canceled && (
        <Alert type="warning" message={<span>此预约单已被预约者取消.</span>} />
      )}
      {showList.deleted && (
        <Alert type="error" message={<span>此预约单已被标记删除.</span>} />
      )}
      <ReplyList
        visible={showDiscuss}
        title={`${name} 的预约单の讨论区`}
        onCancel={() => {
          setShowDiscuss(false);
        }}
        data={discuss}
        postUrl={`/order/${_id}/discuss`}
        onReply={() => {
          onHandleOrder();
        }}
        anonymousName={name}
      />
      <ReplyList
        visible={showReply}
        title={`${name} 的预约单 - 回复消息`}
        onCancel={() => {
          setShowReply(false);
        }}
        data={reply}
        postUrl={`/order/${_id}/reply`}
        onReply={() => {
          onHandleOrder();
        }}
        anonymousName={name}
        showSendEmailCheckbox={showSendEmailCheckbox}
      />
    </div>
  );
};
