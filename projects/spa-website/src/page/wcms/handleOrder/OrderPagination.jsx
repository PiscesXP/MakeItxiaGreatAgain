import { Pagination } from "antd";
import React from "react";
import PropTypes from "prop-types";

/**
 * 预约单界面分页组件.
 */
function OrderPagination(props) {
  const {
    currentPage,
    totalCount,
    onShowSizeChange,
    onChange,
    pageSize
  } = props;
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Pagination
        showSizeChanger
        pageSize={pageSize}
        defaultCurrent={currentPage}
        current={currentPage}
        total={totalCount}
        onChange={onChange}
        onShowSizeChange={onChange}
      />
    </div>
  );
}

OrderPagination.propTypes = {
  pageSize: PropTypes.number,
  totalCount: PropTypes.number,
  currentPage: PropTypes.number,
  onChange: PropTypes.func,
  onShowSizeChange: PropTypes.func
};

export { OrderPagination };
