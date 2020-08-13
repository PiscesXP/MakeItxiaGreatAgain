import React from "react";
import PropTypes from "prop-types";
import { Col, Row } from "antd";
import { OrderPagination } from "./OrderPagination";
import { EmbeddableLoading, Loading } from "COMPONENTS/loading";
import { OrderInfoCard } from "./OrderInfoCard";
import { OrderNotFound } from "COMPONENTS/notFound";

function OrderList(props) {
  const {
    loading,
    data,
    paginationInfo,
    onPaginationChange,
    onHandleOrder
  } = props;

  //加载中
  if (loading && !!!data) {
    return <Loading delay={0} />;
  }

  //分页组件
  const { pageSize, totalCount, currentPage } = paginationInfo;
  const orderPagination = (
    <OrderPagination
      pageSize={pageSize}
      totalCount={totalCount}
      currentPage={currentPage}
      onChange={onPaginationChange}
    />
  );

  let lengthOfData = data.length;
  if (!!!lengthOfData) {
    lengthOfData = 0;
  }

  //渲染
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
              return index < lengthOfData / 2;
            })
            .map(value => {
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
              return index >= lengthOfData / 2;
            })
            .map(value => {
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

OrderList.propTypes = {
  loading: PropTypes.bool.isRequired,
  data: PropTypes.array,
  paginationInfo: PropTypes.object.isRequired,
  onPaginationChange: PropTypes.func.isRequired,
  onHandleOrder: PropTypes.func.isRequired
};

export { OrderList };
