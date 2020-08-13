import React, { useEffect, useState } from "react";
import { OrderForm } from "./OrderForm";
import { OrderResult } from "./OrderResult";
import { Modal, Spin } from "antd";
import * as api from "UTIL/api";
import { useHistory } from "react-router-dom";
import { routePath } from "ROUTE/routePath";

function RequestOrder() {
  const orderIdStorageKey = "requestedOrderId";

  const [loading, setLoading] = useState(true);
  const [orderInfo, setOrderInfo] = useState(null);

  const history = useHistory();

  function handleSubmitSuccess(order) {
    localStorage.setItem(orderIdStorageKey, order["_id"]);
    setOrderInfo(order);
  }

  function handleBackHome() {
    localStorage.removeItem(orderIdStorageKey);
    setOrderInfo(null);
    history.push(routePath.CUSTOM_HOME);
  }

  async function handleCancel() {
    const { _id } = orderInfo;
    try {
      await api.PUT(`/custom/order/${_id}/cancel`);
      Modal.success({
        title: "取消成功",
        content: "预约已取消",
        centered: true,
        onOk: () => {
          setOrderInfo(null);
          localStorage.removeItem(orderIdStorageKey);
          history.push(routePath.CUSTOM_HOME);
        }
      });
    } catch (e) {
      Modal.error({
        title: "取消失败",
        content: "请刷新查看预约单状态 (可能已经被接单)",
        centered: true
      });
    }
  }

  useEffect(() => {
    const orderID = localStorage.getItem(orderIdStorageKey);
    if (!!!orderID) {
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const order = await api.GET(`/custom/order/${orderID}`);
        setOrderInfo(order);
      } catch (e) {
        //找不到对应的预约单, 重置localstorage
        localStorage.removeItem(orderIdStorageKey);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return <Spin />;
  }

  if (orderInfo == null) {
    return <OrderForm onSubmitSuccess={handleSubmitSuccess} />;
  } else {
    return (
      <OrderResult
        order={orderInfo}
        onCancel={handleCancel}
        onBackHome={handleBackHome}
      />
    );
  }
}

export { RequestOrder };
