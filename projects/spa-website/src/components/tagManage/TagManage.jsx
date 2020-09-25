import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import { Form } from "@ant-design/compatible";
import "@ant-design/compatible/assets/index.css";
import { Button, Input, Modal, notification, Table } from "antd";
import React from "react";
import * as timeUtil from "UTIL/time";
import * as api from "@/request/api";

const columns = [
  {
    title: "标签ID",
    dataIndex: "_id",
    key: "id",
  },
  {
    title: "标签名称",
    dataIndex: "tagName",
    key: "tagName",
  },
  {
    title: "引用次数",
    dataIndex: "useCount",
    key: "useCount",
  },
  {
    title: "添加时间",
    dataIndex: "addTime",
    key: "addTime",
    render: (unixTime) => {
      const time = timeUtil.utcDateToText(unixTime);
      return <span>{time}</span>;
    },
  },
  {
    title: "添加人",
    dataIndex: "addBy.realName",
    key: "addBy",
  },
];

class TagManage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: null,
    };
    this.reload = this.reload.bind(this);
    this.add = this.add.bind(this);
  }

  componentDidMount() {
    this.reload();
  }

  reload() {
    this.setState({
      loading: true,
      data: null,
    });
    api.GET("/tag").then((payload) => {
      this.setState({
        loading: false,
        data: payload,
      });
    });
  }

  add() {
    let tagName;
    const onSubmit = () => {
      const key = "addTagNotification";
      notification.info({
        key,
        duration: 0,
        message: "正在添加标签",
        description: `添加标签"${tagName}"中...`,
      });
      api
        .POST("/tag", { tagName })
        .then(() => {
          notification.success({
            key,
            duration: 5,
            message: "添加标签成功",
            description: `成功添加标签：${tagName}`,
          });
          this.reload();
        })
        .catch((message) => {
          notification.error({
            key,
            duration: 0,
            message: "添加标签失败",
            description: message,
          });
          this.reload();
        });
    };
    Modal.confirm({
      title: "填写新标签信息",
      content: (
        <Form>
          <Form.Item label="标签名">
            <Input
              onChange={(e) => {
                tagName = e.target.value;
              }}
            ></Input>
          </Form.Item>
        </Form>
      ),
      centered: true,
      okCancel: true,
      onOk: () => {
        onSubmit();
      },
    });
  }

  render() {
    return (
      <div style={{ overflow: "auto" }}>
        <Form layout="inline" style={{ marginBottom: 16 }} scroll={{ x: true }}>
          <Form.Item>
            <Button
              type="primary"
              icon={<ReloadOutlined />}
              onClick={this.reload}
              loading={this.state.loading}
            >
              刷新
            </Button>
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={this.add}
              loading={this.state.loading}
            >
              添加
            </Button>
          </Form.Item>
        </Form>
        <Table
          columns={columns.map((item) => ({ ...item }))}
          dataSource={
            this.state.data
              ? this.state.data.map((value) => ({
                  key: value._id,
                  ...value,
                }))
              : []
          }
          loading={this.state.loading}
        />
      </div>
    );
  }
}

export { TagManage };
