import React from "react";
import { Col, Row } from "antd";
import { OrderPagination } from "./OrderPagination";
import { EmbeddableLoading, Loading } from "@/components/loading";
import { OrderInfoCard } from "./OrderInfoCard";
import { OrderNotFound } from "@/components/notFound";

interface OrderListProps {
  code: number | null;
  loading: boolean;
  payload: any;
  highlightWords: string[];
  onHandleOrder: () => void;
  onPaginationChange: (page: number, pageSize: number) => void;
}

export const OrderList: React.FC<OrderListProps> = ({
  code,
  loading,
  payload,
  highlightWords,
  onHandleOrder,
  onPaginationChange,
}) => {
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
      <Row gutter={[8, 0]} justify="center" align="top">
        <Col span={24}>{orderPagination}</Col>
        {data.length > 0 ? null : (
          <Col span={24}>
            <OrderNotFound />
          </Col>
        )}
        <Col xs={24} sm={24} md={24} lg={12} xl={10}>
          {data
            .filter((value: any, index: number) => {
              return index < data.length / 2;
            })
            .map((value: { _id: string }) => {
              return (
                <OrderInfoCard
                  key={value._id}
                  data={value}
                  highlightWords={highlightWords}
                  onHandleOrder={onHandleOrder}
                />
              );
            })}
        </Col>
        <Col xs={24} sm={24} md={24} lg={12} xl={10}>
          {data
            .filter((value: any, index: number) => {
              return index >= data.length / 2;
            })
            .map((value: any) => {
              return (
                <OrderInfoCard
                  key={value._id}
                  data={value}
                  highlightWords={highlightWords}
                  onHandleOrder={onHandleOrder}
                />
              );
            })}
        </Col>
        <Col span={24}>{orderPagination}</Col>
      </Row>
    </EmbeddableLoading>
  );
};
