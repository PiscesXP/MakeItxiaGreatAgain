import React, { useState } from "react";
import { Card, Col, Row } from "antd";
import { OrderRecordList } from "./OrderRecordList";
import { SearchCondition } from "./SearchCondition";
import { RequireRecordList } from "./RequireRecordList";
import {
  useApiRequest,
  useDebounce,
  useMount,
  usePersistFn,
  useTitleWCMS,
  useUpdateEffect,
} from "@/hook";
import "./index.css";
import { OrderRecordTagContext } from "./OrderRecordTagContext";

export const OrderRecordPage: React.FC = () => {
  useTitleWCMS("经验纪录");

  const [condition, setCondition] = useState({
    onlyStar: false,
    tags: [],
    text: "",
  });

  const [pagination, setPagination] = useState({ page: 1, size: 10 });

  const recordListApiRequest = useApiRequest({
    path: "/orderRecord",
    manual: true,
    popModal: {
      onFail: true,
      onError: true,
    },
  });

  const refreshRecord = usePersistFn(() => {
    recordListApiRequest.sendRequest({
      requestQuery: {
        ...condition,
        ...pagination,
      },
    });
  });

  useMount(() => {
    refreshRecord();
  });

  useUpdateEffect(() => {
    refreshRecord();
  }, [condition]);

  const requireRecordOrderListApiRequest = useApiRequest({
    path: "/order/me/requireRecord",
  });

  function handleRefreshRecordList() {
    refreshRecord();
  }

  function handlePostRecord() {
    //刷新
    requireRecordOrderListApiRequest.sendRequest();
    refreshRecord();
  }

  function handlePaginationChange(page: number, size: number) {
    setPagination({ page, size });
  }

  const handleConditionChange = useDebounce((values) => {
    setCondition(values);
  }, 1500);

  return (
    <OrderRecordTagContext>
      <Row gutter={[8, 8]} justify="center" align="top">
        <Col sm={24} lg={8}>
          <RequireRecordList
            loading={requireRecordOrderListApiRequest.loading}
            orderList={requireRecordOrderListApiRequest.payload}
            onPostRecord={handlePostRecord}
          />
          <Card title="筛选">
            <SearchCondition onConditionChange={handleConditionChange} />
          </Card>
        </Col>
        <Col sm={24} lg={16}>
          <Card title="经验记录">
            <OrderRecordList
              loading={recordListApiRequest.loading}
              payload={recordListApiRequest.payload}
              onPaginationChange={handlePaginationChange}
              refresh={handleRefreshRecordList}
            />
          </Card>
        </Col>
      </Row>
    </OrderRecordTagContext>
  );
};
