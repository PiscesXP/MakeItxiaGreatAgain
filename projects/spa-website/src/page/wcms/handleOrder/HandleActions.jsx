import React, { useContext, useState } from "react";
import { Alert, Button, Modal, Popconfirm } from "antd";
import * as api from "UTIL/api";
import { UserInfoContext } from "CONTEXT/UserInfo";
import { ReplyList } from "COMPONENTS/reply";

/**
 * 显示预约单卡片底下的按钮.(接单/放回...)
 */
function HandleActions(props) {
  const userInfoContext = useContext(UserInfoContext);
  const { _id: userID, role } = userInfoContext; //当前登录用户的id

  const { data, onHandleOrder } = props;
  const { _id, name, status, handler, discuss } = data;

  const isMyOrder = handler && userID === handler._id; //是否是自己的预约单

  //决定显示哪些按钮/提示框
  const showList = {
    accept: false, //自己可以接单
    giveup: false,
    done: false,
    delete: false,
    acceptByOther: false, //别的人接了单
    doneByOther: false,
    canceled: false,
    deleted: false,
    discuss: false, //评论区
  };

  switch (status) {
    case "PENDING":
      showList.accept = true;
      showList.delete = true;
      break;
    case "HANDLING":
      showList.delete = true;
      if (isMyOrder) {
        showList.giveup = true;
        showList.done = true;
      } else {
        showList.acceptByOther = true;
      }
      break;
    case "DONE":
      showList.doneByOther = true;
      break;
    case "CANCELED":
      showList.canceled = true;
      break;
    default:
      break;
  }

  if (role !== "ADMIN" && role !== "SUPER_ADMIN") {
    showList.delete = false;
  }

  const [submitType, setSubmitType] = useState(null);

  /**
   * 提交更改.(接单/放回...)
   * @param {String} actionType
   */
  const onSubmit = (actionType) => async () => {
    setSubmitType(actionType);
    try {
      const { code } = await api.PUT(`/order/${_id}/deal/${actionType}`);
      if (code === 0) {
        let actionName;
        switch (actionType) {
          case "accept":
            actionName = "接受";
            break;
          case "done":
            actionName = "完成";
            break;
          case "giveup":
            actionName = "放回";
            break;
          case "delete":
            actionName = "删除";
            break;
          default:
        }
        Modal.success({
          title: "操作成功",
          content: `预约单已成功${actionName}.`,
          okText: "确定",
          centered: true,
          onOk: () => {
            onHandleOrder();
          },
        });
      } else {
        Modal.error({
          title: "操作失败",
          content: "请刷新后重试.(可能预约单已被接受或取消)",
          okText: "确定",
          centered: true,
        });
      }
    } catch (error) {
      Modal.error({
        title: "操作失败",
        content: error.toString(),
        okText: "确定",
        centered: true,
      });
    } finally {
      setSubmitType(null);
    }
  };

  const [showDiscuss, setShowDiscuss] = useState(false);

  const discussCount = discuss.length;

  return (
    <div className="order-btn-container">
      {showList.discuss ? (
        <Button
          onClick={() => {
            setShowDiscuss(true);
          }}
        >
          讨论区 ({discussCount}条)
        </Button>
      ) : null}
      {showList.accept ? (
        <Popconfirm
          title="确定要接单吗?"
          okText="确定"
          cancelText="取消"
          onConfirm={onSubmit("accept")}
        >
          <Button type="primary" loading={submitType === "accept"}>
            我来处理
          </Button>
        </Popconfirm>
      ) : null}
      {showList.giveup ? (
        <Popconfirm
          title="确定要放回吗?"
          okText="确定"
          cancelText="取消"
          onConfirm={onSubmit("giveup")}
        >
          <Button loading={submitType === "giveup"}>放回</Button>
        </Popconfirm>
      ) : null}
      {showList.done ? (
        <Popconfirm
          title="确定完成预约单了吗?"
          okText="确定"
          cancelText="取消"
          onConfirm={onSubmit("done")}
        >
          <Button type="primary" loading={submitType === "done"}>
            完成
          </Button>
        </Popconfirm>
      ) : null}
      {showList.delete ? (
        <Popconfirm
          title="确定要删除预约单吗?"
          okText="确定"
          cancelText="取消"
          onConfirm={onSubmit("delete")}
        >
          <Button type="danger" loading={submitType === "delete"}>
            删除
          </Button>
        </Popconfirm>
      ) : null}
      {showList.acceptByOther ? (
        <Alert
          type="info"
          message={
            <span>
              正由 <strong>{handler && handler.realName}</strong> 处理中.
            </span>
          }
        ></Alert>
      ) : null}
      {showList.doneByOther ? (
        <Alert
          type="success"
          message={
            <span>
              已由 <strong>{handler.realName}</strong> 处理完成.
            </span>
          }
        ></Alert>
      ) : null}
      {showList.canceled ? (
        <Alert
          type="warning"
          message={<span>此预约单已被预约人取消.</span>}
        ></Alert>
      ) : null}
      {showList.deleted ? (
        <Alert
          type="error"
          message={<span>此预约单已被标记删除.</span>}
        ></Alert>
      ) : null}
      <ReplyList
        visible={showDiscuss}
        title={`${name} 的预约单の讨论区`}
        onCancel={() => {
          setShowDiscuss(false);
        }}
        data={discuss}
        postUrl={`/order/${_id}/discuss`}
        onReply={() => {
          //TODO
        }}
      ></ReplyList>
    </div>
  );
}

export { HandleActions };
