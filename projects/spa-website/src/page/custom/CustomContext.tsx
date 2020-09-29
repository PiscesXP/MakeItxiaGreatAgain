import React, { useContext } from "react";
import { useLocalStorageState } from "@/hook/useLocalStorageState";
import { useApiRequest } from "@/hook/useApiRequest";
import { usePersistFn } from "@/hook/usePersisFn";

interface CustomContextInterface {
  orderID: string | null;
  order?: any | null;
  hasOrder: () => boolean;
  setOrder: (orderID: string) => void;
  refreshOrder: () => void;
  resetOrder: () => void;
}

const CustomContext = React.createContext<CustomContextInterface | null>(null);

export const useCustomContext = () => {
  return useContext(CustomContext) as CustomContextInterface;
};

export const CustomContextProvider: React.FC = (props) => {
  const [orderID, setOrderID] = useLocalStorageState<string | null>(
    "requestedOrderId",
    null
  );

  const orderApiRequest = useApiRequest({
    path: `/custom/order/${orderID}`,
    onUnsuccessful: () => {
      //未找到该预约单
      setOrderID(null);
    },
  });

  const hasOrder = usePersistFn(() => !!orderID);

  const setOrder = usePersistFn((newOrderID: string) => {
    setOrderID(newOrderID);
    orderApiRequest.sendRequest();
  });

  const refreshOrder = usePersistFn(() => {
    orderApiRequest.sendRequest();
  });

  const resetOrder = usePersistFn(() => {
    setOrderID(null);
  });

  const contextValue: CustomContextInterface = {
    orderID: orderID || null,
    order: orderApiRequest.payload || null,
    hasOrder,
    setOrder,
    refreshOrder,
    resetOrder,
  };

  return (
    <CustomContext.Provider value={contextValue}>
      {props.children}
    </CustomContext.Provider>
  );
};
