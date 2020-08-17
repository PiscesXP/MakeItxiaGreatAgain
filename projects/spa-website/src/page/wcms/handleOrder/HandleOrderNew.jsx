import React from "react";
import { Divider, Modal } from "antd";
import { SearchConditionBar } from "./SearchConditionBar";
import * as api from "UTIL/api";
import { OrderList } from "./OrderList";
import "./index.css";

/**
 * 浮生日记.
 * 2020.03.21
 * 今天本想用hook重构这个函数的，可惜弄了俩小时，最后还是用了class组件.
 * 原因在多个hook setState没法合并更新，不然会频繁重复更新子组件.
 * 这个组件(这整个文件夹的)的复杂度还是蛮高的，没法写得很简洁.
 * 但尽量保证可维护性吧...
 * */

/**
 * 接单页.
 * */
class HandleOrderNew extends React.Component {
  constructor(props) {
    super(props);
    document.title = "预约单 - IT侠后台管理系统";
    this.handleConditionChange = this.handleConditionChange.bind(this);
    this.handleHandleOrder = this.handleHandleOrder.bind(this);
    this.handlePaginationChange = this.handlePaginationChange.bind(this);
  }
  state = {
    //加载的状态
    loading: true,
    //预约单数据
    data: null,
    //分页状态
    pagination: {
      currentPage: 1,
      totalCount: 0,
      pageSize: 10,
    },
    //查询条件
    condition: {
      onlyMine: false,
      campus: "",
      status: ["等待处理", "正在处理"],
    },
  };

  /**
   * 生成获取预约单的url.
   * @return {String} url.
   * */
  buildUrl() {
    let queryString = "/order?";
    //查询条件
    const { onlyMine, campus, status } = this.state.condition;
    if (onlyMine) {
      queryString += "&onlyMine=1";
    }
    if (campus) {
      queryString += `&campus=${campus}`;
    }
    queryString += `&status=${status.join(",")}`;
    //分页
    const { currentPage, pageSize } = this.state.pagination;
    queryString += `&page=${currentPage}&size=${pageSize}`;

    return queryString;
  }

  /**
   * 获取数据.
   * */
  async fetchData() {
    try {
      this.setState({ loading: true });
      const { code, message, payload: rawData } = await api.GET(
        this.buildUrl()
      );
      if (code === 0) {
        this.setState({
          loading: false,
          data: rawData.data,
          pagination: rawData.pagination,
        });
      } else {
        Modal.error({
          title: "获取预约单失败",
          content: message,
          centered: true,
        });
      }
    } catch (error) {
      Modal.error({
        title: "获取预约单失败",
        content: error.toString(),
        centered: true,
      });
    }
  }

  handleConditionChange(condition) {
    this.setState({ condition });
    this.fetchData();
  }

  handlePaginationChange(newCurrentPage, newPageSize) {
    const newPagination = Object.assign(this.state.pagination, {
      currentPage: newCurrentPage,
      pageSize: newPageSize,
    });
    this.setState({ pagination: newPagination });
    //刷新数据
    this.fetchData();
  }

  handleHandleOrder() {
    //TODO 用于处理单子后刷新数据
    this.fetchData();
  }

  render() {
    const { loading, data, pagination } = this.state;
    return (
      <div>
        <SearchConditionBar onConditionChange={this.handleConditionChange} />
        <Divider />
        <OrderList
          loading={loading}
          data={data}
          paginationInfo={pagination}
          onHandleOrder={this.handleHandleOrder}
          onPaginationChange={this.handlePaginationChange}
        />
      </div>
    );
  }
}

export { HandleOrderNew };
