import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useApi, useMemberContext, useTitleWCMS } from "HOOK";
import { SearchCondition } from "PAGE/wcms/handleOrder/SearchCondition";
import { CenterMeResponsive } from "COMPONENTS/layout";
import { Divider } from "antd";
import { OrderList } from "PAGE/wcms/handleOrder/OrderList";
import { debounceFn } from "UTIL/common";

/**
 * 浮生日记.
 * 2020.03.21
 * 今天本想用hook重构这个函数的，可惜弄了俩小时，最后还是用了class组件.
 * 原因在多个hook setState没法合并更新，不然会频繁重复更新子组件.
 * 这个组件(这整个文件夹的)的复杂度还是蛮高的，没法写得很简洁.
 * 但尽量保证可维护性吧...
 *
 * 2020.08.21
 * 用hook重构真爽,果然自己封装hook才是最吼滴.
 * class component多个state合在一起真是太难受了.
 * (对了,没用到qs,也是轻松不少)
 *
 * */
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
