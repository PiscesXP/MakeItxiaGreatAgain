import React, { useEffect, useState } from "react";
import { OrderForm } from "./OrderForm";
import { OrderResult } from "./OrderResult";
import { Modal, Spin } from "antd";
import * as api from "@/request/api";
import { useHistory } from "react-router-dom";
import { routePath } from "PAGE/routePath";
import { useTitleCustom } from "HOOK";

const orderIdStorageKey = "requestedOrderId";

function RequestOrder() {
  useTitleCustom("预约单");

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
    history.push(routePath.CUSTOM);
  }

  async function handleCancel() {
    const { _id } = orderInfo;
    try {
      const { code } = await api.PUT(`/custom/order/${_id}/cancel`);
      if (code === 0) {
        Modal.success({
          title: "取消成功",
          content: "预约已取消",
          centered: true,
          onOk: () => {
            setOrderInfo(null);
            localStorage.removeItem(orderIdStorageKey);
            history.push(routePath.CUSTOM);
          },
        });
      } else {
        Modal.error({
          title: "取消失败",
          content: "请刷新查看预约单状态 (可能已经被接单)",
          centered: true,
        });
      }
    } catch (error) {
      Modal.error({
        title: "取消失败",
        content: error.toString(),
        centered: true,
      });
    }
  }

  /**
   * 刷新预约单数据.
   * */
  async function refreshOrderData() {
    if (orderInfo && orderInfo._id) {
      const { code, payload } = await api.GET(`/custom/order/${orderInfo._id}`);
      if (code === 0) {
        setOrderInfo(payload);
      }
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
        const { code, payload: order } = await api.GET(
          `/custom/order/${orderID}`
        );
        if (code === 0) {
          //成功获取预约单
          setOrderInfo(order);
        } else {
          //找不到对应的预约单, 重置localstorage
          localStorage.removeItem(orderIdStorageKey);
        }
      } catch (e) {
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
        refreshOrderData={refreshOrderData}
      />
    );
  }
}

export { RequestOrder };
