import { Form, notification, Switch } from "antd";
import React from "react";
import * as api from "@/request/api";
import HandleOrderForm from "./HandleOrderForm";

const data = [];

class HandleOrder extends React.Component {
  constructor(props) {
    super(props);
    this.updateData = this.updateData.bind(this);
  }
  state = {
    bordered: false,
    loading: false,
    pagination: { current: 1, pageSize: 10 },
    size: "default",
    title: () => "预约单列表",
    showHeader: true,
    rowSelection: {},
    scroll: undefined,
    hasData: true,
    tableLayout: undefined,
    campus: 0,
    data,
    filters: {},
    tagList: [],
  };

  componentDidMount() {
    this.updateData();
  }

  updateData() {
    this.fetchTableData();
    this.fetchTags();
  }
  /**
   *
   * @param {number} page
   * @param {Array} filters
   * @param {*} sorter
   */
  async fetchTableData(pagination = this.state.pagination, filters, sorter) {
    this.setState({
      loading: true,
    });
    const { current: page = 1 } = pagination;

    let pageCountPath = `/order/count?`;
    let tableDataPath = `/order?page=${page - 1}`;

    for (const filterName in filters) {
      const filterValue = filters[filterName];
      if (Array.isArray(filterValue) && filterValue.length === 0) {
        //避免空array
      } else {
        pageCountPath += `&${filterName}=${filterValue}`;
        tableDataPath += `&${filterName}=${filterValue}`;
      }
    }

    if (sorter && sorter.column) {
      const direction = sorter.order === "ascend" ? 1 : -1;
      tableDataPath += `&sort=${sorter.field},${direction}`;
    }

    try {
      //获取页数
      const totalOrderCount = await api.GET(pageCountPath);
      pagination.total = totalOrderCount;
      //修正页码： 如果当前页码 > 总页，则页码变为最大允许的页码
      let maxAllowPage = Math.floor(pagination.total / pagination.pageSize);
      if (pagination.total % pagination.pageSize !== 0) {
        ++maxAllowPage;
      }
      if (pagination.current > maxAllowPage) {
        pagination.current = maxAllowPage;
      }
      //获取数据
      const data = await api.GET(tableDataPath);
      this.setState({
        loading: false,
        pagination,
        data,
      });
    } catch (reason) {
      notification.error({
        message: "网络请求失败",
        description: reason,
        duration: 0,
      });
    }
  }

  async fetchTags() {
    try {
      const tagPayload = await api.GET("/tag");
      this.setState({
        tagList: tagPayload,
      });
    } catch (reason) {
      notification.error({
        message: "网络请求失败",
        description: reason,
        duration: 0,
      });
    }
  }

  handleToggle = (enable) => {
    this.setState({ bordered: enable });
  };

  handleCampusChange = (e) => {
    this.setState({ campus: e.target.value });
  };

  handleShowFinishChange = (enable) => {
    this.setState({ showFinish: enable });
  };

  /**
   * 处理分页、筛选、排序
   */
  handlePageChange = (pagination, filters, sorter) => {
    this.fetchTableData(pagination, filters, sorter);
  };

  render() {
    const { state } = this;
    return (
      <div style={{ overflow: "auto" }}>
        <Form layout="inline" style={{ marginBottom: 16 }} scroll={{ x: true }}>
          <Form.Item label="显示边框">
            <Switch checked={state.bordered} onChange={this.handleToggle} />
          </Form.Item>
        </Form>
        <HandleOrderForm
          loading={this.state.loading}
          bordered={this.state.bordered}
          data={this.state.data}
          pagination={this.state.pagination}
          tagList={this.state.tagList}
          onRequireUpdate={this.updateData}
          onPageChange={this.handlePageChange}
        />
      </div>
    );
  }
}

export default HandleOrder;
