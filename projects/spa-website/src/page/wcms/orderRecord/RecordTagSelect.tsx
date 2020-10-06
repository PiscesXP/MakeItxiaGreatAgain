import React, { useState } from "react";
import { Select, Divider, Input, Button } from "antd";
import { useApiRequest } from "@/hook";
import { PlusOutlined } from "@ant-design/icons";
import "./condition.css";

const { Option } = Select;

interface RecordTagProps {
  onChange?: any;
}

export const RecordTagSelect: React.FC<RecordTagProps> = ({ onChange }) => {
  const { loading, payload, sendRequest: refreshTags } = useApiRequest({
    path: "/orderRecordTag",
    requestQuery: {
      detail: 1,
    },
    popModal: {
      onFail: true,
      onError: true,
    },
  });

  const addTagApiRequest = useApiRequest({
    path: "/orderRecordTag",
    method: "POST",
    manual: true,
    popModal: {
      onFail: true,
      onError: true,
    },
    onSuccess: () => {
      //刷新数据
      refreshTags();
    },
  });

  const [inputValue, setInputValue] = useState();

  function handleInputChange(e: any) {
    setInputValue(e.target.value);
  }

  function handleAddTag() {
    addTagApiRequest.sendRequest({
      requestBody: {
        name: inputValue,
      },
    });
    setInputValue(undefined);
  }

  return (
    <Select
      loading={loading}
      placeholder="选择标签"
      mode="tags"
      allowClear
      onChange={onChange}
      dropdownRender={(menu) => (
        <div>
          {menu}
          <Divider dashed className="tag-dropDown-divider" />
          <div className="tag-dropDown">
            <Input
              value={inputValue}
              placeholder="新标签名称"
              onChange={handleInputChange}
              onPressEnter={handleAddTag}
            />
            <Button
              type="primary"
              disabled={/^\s*$/.test(inputValue || "")}
              onClick={handleAddTag}
            >
              <PlusOutlined />
              添加
            </Button>
          </div>
        </div>
      )}
    >
      {Array.isArray(payload) &&
        payload.map((tagItem: any) => {
          return (
            <Option key={tagItem._id} value={tagItem._id}>
              {`${tagItem.name} (${tagItem.referCount || "0"})`}
            </Option>
          );
        })}
    </Select>
  );
};
