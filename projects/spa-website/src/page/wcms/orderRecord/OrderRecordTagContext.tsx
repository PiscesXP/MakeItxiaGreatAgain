import React, { useContext } from "react";
import { useApiRequest } from "@/hook";

declare type Tag = {
  _id: string;
  name: string;
  referCount: number;
};

interface TagContextInterface {
  tags: Tag[];
  refreshTags: () => void;
}

const TagContext = React.createContext<TagContextInterface | null>(null);

export const OrderRecordTagContext: React.FC = ({ children }) => {
  const { payload, sendRequest: refreshTags } = useApiRequest({
    path: "/orderRecordTag",
    requestQuery: {
      detail: 1,
    },
    popModal: {
      onFail: true,
      onError: true,
    },
  });

  if (!payload) {
    return null;
  }

  const contextValue = {
    tags: payload,
    refreshTags,
  };

  return (
    <TagContext.Provider value={contextValue}>{children}</TagContext.Provider>
  );
};

export const useOrderRecordTags = () => {
  return useContext(TagContext) as TagContextInterface;
};
