import { Modal } from "antd";
import React from "react";
import * as api from "UTIL/api";
import { MemberListTable } from "./MemberListTable";

class MemberList extends React.Component {
  constructor(props) {
    super(props);
    this.handleActionDone = this.handleActionDone.bind(this);
  }
  state = {
    loading: false,
    data: []
  };

  componentDidMount() {
    this.updateData();
  }

  handleActionDone() {
    this.updateData();
  }

  async updateData() {
    this.setState({
      loading: true
    });
    try {
      const data = await api.GET("/user");
      this.setState({
        loading: false,
        data
      });
    } catch (error) {
      Modal.error({
        title: "获取成员列表失败",
        content: error.message,
        centered: true
      });
    }
  }

  render() {
    return (
      <MemberListTable {...this.state} onActionDone={this.handleActionDone} />
    );
  }
}

export { MemberList };
