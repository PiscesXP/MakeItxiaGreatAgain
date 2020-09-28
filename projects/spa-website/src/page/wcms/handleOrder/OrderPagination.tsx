import { Pagination } from "antd";
import React from "react";

interface OrderPaginationProps {
  currentPage?: number;
  totalCount?: number;
  pageSize?: number;
  onChange?: (page: number, pageSize: number) => void;
}

/**
 * 预约单界面分页组件.
 */
const OrderPagination: React.FC<OrderPaginationProps> = ({
  currentPage,
  totalCount,
  pageSize,
  onChange,
}) => {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Pagination
        showSizeChanger
        pageSize={pageSize}
        defaultCurrent={currentPage}
        current={currentPage}
        total={totalCount}
        onChange={onChange as any}
        onShowSizeChange={onChange}
      />
    </div>
  );
};

export { OrderPagination };
