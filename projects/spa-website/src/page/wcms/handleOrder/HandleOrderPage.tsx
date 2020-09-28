import React, { useEffect, useMemo, useState } from "react";
import { useMemberContext, useTitleWCMS } from "HOOK";
import { SearchCondition } from "./SearchCondition";
import { CenterMeResponsive } from "@/components/layout";
import { Divider } from "antd";
import { OrderList } from "./OrderList";
import { debounceFn } from "@/util/common";
import { useLocalStorageState } from "@/hook/useLocalStorageState";
import { useApiRequest } from "@/hook/useApiRequest";
import { CampusEnum, OrderStatusEnum } from "@/util/enum";
import { useDebounce } from "@/hook/useDebounce";

interface OrderSearchCondition {
  onlyMine: boolean;
  campus: CampusEnum;
  status: OrderStatusEnum;
  text: string;
  orderTime: any;
}

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

  const [condition, setCondition] = useLocalStorageState<OrderSearchCondition>(
    "orderSearchCondition",
    {
      onlyMine: false,
      campus: memberContext.campus,
      status: OrderStatusEnum.PENDING,
      text: "",
      orderTime: null,
    }
  );

  const [pagination, setPagination] = useState({ page: 1, size: 10 });

  const { code, loading, payload, sendRequest } = useApiRequest({
    path: "/order",
    requestQuery: condition,
    manual: true,
    popModal: { onFail: true, onError: true },
  });

  const refreshOrder = useDebounce(() => {
    sendRequest({ requestQuery: { ...condition, ...pagination } });
  }, 2000);

  useEffect(() => {
    refreshOrder();
  }, [refreshOrder]);

  const handleConditionChange = useMemo(
    () =>
      debounceFn((a: any, newCondition: any, b: any) => {
        setCondition(newCondition);
      }, 1000),
    [setCondition]
  );

  function handlePaginationChange(page: number, size: number) {
    setPagination({ page, size });
  }

  function handleHandleOrder() {
    refreshOrder();
  }

  const highlightWords = useMemo(() => {
    if (condition && condition.text) {
      return [condition.text];
    }
    return [];
  }, [condition]);

  return (
    <div>
      {/* @ts-ignore*/}
      <CenterMeResponsive>
        <SearchCondition
          onConditionChange={handleConditionChange}
          initialValues={condition}
          onFieldsChange={handleConditionChange}
          condition={condition}
        />
        <Divider dashed />
      </CenterMeResponsive>
      <OrderList
        code={code}
        loading={loading}
        payload={payload}
        highlightWords={highlightWords}
        onHandleOrder={handleHandleOrder}
        onPaginationChange={handlePaginationChange}
      />
    </div>
  );
}

export { HandleOrder };
