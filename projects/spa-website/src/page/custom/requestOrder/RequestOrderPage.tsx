import React from "react";
import { OrderForm } from "./OrderForm";
import { OrderResult } from "./OrderResult";
import { useTitleCustom } from "@/hook/useTitle";
import { useCustomContext } from "@/page/custom/CustomContext";
import { Loading } from "@/components/loading";

export const RequestOrderPage: React.FC = () => {
  useTitleCustom("预约单");

  const customContext = useCustomContext();

  if (customContext.hasOrder()) {
    if (customContext.order) {
      //显示预约单信息
      return <OrderResult />;
    } else {
      return <Loading />;
    }
  } else {
    //填写
    return <OrderForm />;
  }
};
