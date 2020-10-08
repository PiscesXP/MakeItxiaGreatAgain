import React, { useState } from "react";
import { Card, Col, Modal, Row } from "antd";
import { OrderRecordList } from "./OrderRecordList";
import { SearchCondition } from "./SearchCondition";
import { RequireRecordList } from "./RequireRecordList";
import {
  useApiRequest,
  useDebounce,
  useLocalStorageState,
  useMount,
  usePersistFn,
  useTitleWCMS,
  useUpdateEffect,
} from "@/hook";
import "./index.css";
import { OrderRecordTagContext } from "./OrderRecordTagContext";

export const OrderRecordPage: React.FC = () => {
  useTitleWCMS("经验纪录");

  const [skipIntro, setSkipIntro] = useLocalStorageState<boolean>(
    "expIntro",
    false
  );
  useMount(() => {
    if (skipIntro) return;
    Modal.info({
      title: "此页面记录预约单维修情况、经验总结",
      content: (
        <div>
          <p>
            当你在接单页面完成预约单后，这里会提示你填写记录。
            你可在任何时候填写、修改。
          </p>
          <p>
            tag可以标记预约单相关信息，还可记录实际维修情况，如翻车、联系不上等等。你可随时添加标签。
          </p>
          <p>这些记录对经验交流、内训、数据分析都有帮助，请务必善用。</p>
          <p>功能测试中，有问题可找zzx及时反馈。</p>
        </div>
      ),
      centered: true,
      okText: "知道了",
      onOk: () => {
        setSkipIntro(true);
      },
    });
  });

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
  }, [condition, pagination]);

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
