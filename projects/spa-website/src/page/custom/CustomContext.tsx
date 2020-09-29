import React, { useContext } from "react";
import { useLocalStorageState } from "@/hook/useLocalStorageState";
import { useApiRequest } from "@/hook/useApiRequest";
import { usePersistFn } from "@/hook/usePersisFn";

interface CustomContextInterface {
  orderID: string | null;
  order?: any | null;
  hasOrder: () => boolean;
  retrieveExistedOrder: (existedOrderID: string) => void;
}

const CustomContext = React.createContext<CustomContextInterface | null>(null);

export const useCustomContext = () => {
  return useContext(CustomContext) as CustomContextInterface;
};

export const CustomContextProvider: React.FC = (props) => {
  const [orderID, setOrderID, removeOrderID] = useLocalStorageState<
    string | null
  >("requestedOrderId", null);

  const orderApiRequest = useApiRequest({
    path: `/custom/order/${orderID}`,
  });

  const hasOrder = usePersistFn(() => !!orderID);

  const retrieveExistedOrder = usePersistFn((existedOrderID: string) => {
    setOrderID(existedOrderID);
    orderApiRequest.sendRequest();
  });

  const contextValue: CustomContextInterface = {
    orderID: orderID || null,
    order: orderApiRequest.payload || null,
    hasOrder,
    retrieveExistedOrder,
  };

  return (
    <CustomContext.Provider value={contextValue}>
      {props.children}
    </CustomContext.Provider>
  );
};
