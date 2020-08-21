import React from "react";
import { Col, Row } from "antd";
import { OrderPagination } from "./OrderPagination";
import { EmbeddableLoading, Loading } from "COMPONENTS/loading";
import { OrderInfoCard } from "./OrderInfoCard";
import { OrderNotFound } from "COMPONENTS/notFound";

function OrderList({
  code,
  loading,
  payload,
  onHandleOrder,
  onPaginationChange,
}) {
  //加载中
  if (code !== 0) {
    return <Loading delay={0} />;
  }

  const { data, pagination } = payload;

  //分页组件
  const { pageSize, totalCount, currentPage } = pagination;
  const orderPagination = (
    <OrderPagination
      pageSize={pageSize}
      totalCount={totalCount}
      currentPage={currentPage}
      onChange={onPaginationChange}
    />
  );

  return (
    <EmbeddableLoading loading={loading}>
      <Row gutter={[8, 0]} type="flex" justify="center" align="top">
        <Col span={24}>{orderPagination}</Col>
        {data.length > 0 ? null : (
          <Col span={24}>
            <OrderNotFound />
          </Col>
        )}
        <Col xs={24} sm={24} md={24} lg={12} xl={10}>
          {data
            .filter((value, index) => {
              return index < data.length / 2;
            })
            .map((value) => {
              return (
                <OrderInfoCard
                  key={value._id}
                  data={value}
                  onHandleOrder={onHandleOrder}
                />
              );
            })}
        </Col>
        <Col xs={24} sm={24} md={24} lg={12} xl={10}>
          {data
            .filter((value, index) => {
              return index >= data.length / 2;
            })
            .map((value) => {
              return (
                <OrderInfoCard
                  key={value._id}
                  data={value}
                  onHandleOrder={onHandleOrder}
                />
              );
            })}
        </Col>
        <Col span={24}>{orderPagination}</Col>
      </Row>
    </EmbeddableLoading>
  );
}

export { OrderList };
