import { Pagination } from "antd";
import React from "react";

/**
 * 预约单界面分页组件.
 */
function OrderPagination({ currentPage, totalCount, onChange, pageSize }) {
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

export { OrderPagination };
