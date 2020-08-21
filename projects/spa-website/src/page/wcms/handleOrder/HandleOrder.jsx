import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useApi, useMemberContext, useTitleWCMS } from "HOOK";
import { SearchCondition } from "PAGE/wcms/handleOrder/SearchCondition";
import { CenterMeResponsive } from "COMPONENTS/layout";
import { Divider } from "antd";
import { OrderList } from "PAGE/wcms/handleOrder/OrderList";
import { debounceFn } from "UTIL/common";

function HandleOrder() {
  useTitleWCMS("预约单");

  const memberContext = useMemberContext();

  const [condition, setCondition] = useState({
    onlyMine: false,
    campus: memberContext.campus,
    status: "PENDING",
    text: "",
    orderTime: null,
  });

  const [pagination, setPagination] = useState({ page: 1, size: 10 });

  const { code, loading, payload, send } = useApi({
    path: "/order",
    query: condition,
    later: true,
  });

  const sendRequest = useCallback(() => {
    const { orderTime, ...orderCondition } = condition;
    if (Array.isArray(orderTime) && orderTime.length === 2) {
      orderCondition.startTime = orderTime[0]._d.toISOString();
      orderCondition.endTime = orderTime[1]._d.toISOString();
    }
    //获取数据
    send(null, { ...orderCondition, ...pagination });
  }, [condition, pagination, send]);

  useEffect(() => {
    sendRequest();
  }, [sendRequest]);

  const handleConditionChange = useMemo(
    () =>
      debounceFn((newCondition) => {
        setCondition(newCondition);
      }, 1000),
    [setCondition]
  );

  function handlePaginationChange(page, size) {
    setPagination({ page, size });
  }

  function handleHandleOrder() {
    sendRequest();
  }

  return (
    <div>
      <CenterMeResponsive>
        <SearchCondition
          onConditionChange={handleConditionChange}
          condition={condition}
        />
        <Divider dashed />
      </CenterMeResponsive>
      <OrderList
        code={code}
        loading={loading}
        payload={payload}
        onHandleOrder={handleHandleOrder}
        onPaginationChange={handlePaginationChange}
      />
    </div>
  );
}

export { HandleOrder };
