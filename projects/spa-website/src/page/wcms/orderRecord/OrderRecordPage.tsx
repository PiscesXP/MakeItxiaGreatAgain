import React from "react";
import { Card, Col, Divider, Row } from "antd";
import { OrderRecordList } from "./OrderRecordList";
import { SearchCondition } from "./SearchCondition";
import { RequireRecordList } from "./RequireRecordList";
import { useApiRequest } from "@/hook";

export const OrderRecordPage: React.FC = () => {
  const recordListApiRequest = useApiRequest({
    path: "/orderRecord",
  });

  const requireRecordOrderListApiRequest = useApiRequest({
    path: "/order/me/requireRecord",
  });

  function handlePostRecord() {
    //刷新
    requireRecordOrderListApiRequest.sendRequest();
  }

  return (
    <Row gutter={[8, 0]} justify="center" align="top">
      <Col sm={24} lg={8}>
        <Card title="需要填写">
          <RequireRecordList
            loading={requireRecordOrderListApiRequest.loading}
            orderList={requireRecordOrderListApiRequest.payload}
            onPostRecord={handlePostRecord}
          />
        </Card>
        <Divider dashed />
        <Card title="筛选">
          <SearchCondition />
        </Card>
        <Divider dashed />
      </Col>
      <Col sm={24} lg={16}>
        <Card title="经验记录">
          <OrderRecordList
            loading={recordListApiRequest.loading}
            payload={recordListApiRequest.payload}
            onPaginationChange={() => {
              //TODO
            }}
          />
        </Card>
      </Col>
    </Row>
  );
};
