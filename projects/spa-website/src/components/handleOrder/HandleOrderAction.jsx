import React from "react";
import * as api from "@/request/api";
import { Button, Modal, Popconfirm } from "antd";

export default class Action extends React.Component {
  state = {
    loading: false,
    actionName: null,
  };
  async handleAction(actionName, putPath) {
    this.setState({
      loading: true,
      actionName,
    });
    const { _id } = this.props;
    try {
      await api.PUT(`/order/${_id}/${putPath}`);
      Modal.success({
        title: "操作成功",
        content: "预约单已成功" + actionName,
        centered: true,
      });
      this.props.onActionDone();
    } catch (error) {
      Modal.error({
        title: "操作失败",
        content: error.toString(),
        centered: true,
      });
    }
    this.setState({
      loading: false,
      actionName: null,
    });
  }

  generateButtons() {
    const generateButton = function (key, actionName, putPath, buttonType) {
      return (
        <Popconfirm
          key={key}
          title={`确定要${actionName}吗？`}
          okText="确定"
          cancelText="取消"
          onConfirm={() => {
            this.handleAction(actionName, putPath);
          }}
        >
          <Button
            type={buttonType}
            size="small"
            style={{
              margin: "0.5em",
            }}
            loading={this.state.loading && this.state.actionName === actionName}
            disabled={this.state.loading}
          >
            {actionName}
          </Button>
        </Popconfirm>
      );
    };
    const buttonList = [];
    const { status } = this.props;
    switch (status) {
      case "等待处理":
        buttonList.push(
          generateButton.call(this, 0, "接单", "accept", "primary")
        );
        break;
      case "正在处理":
        //TODO 判断是否是该用户接的单
        buttonList.push(
          generateButton.call(this, 1, "放回", "giveup", "primary")
        );
        break;
      default:
    }
    return buttonList;
  }

  render() {
    const buttonList = this.generateButtons();
    return <div>{buttonList.map((value) => value)}</div>;
  }
}
