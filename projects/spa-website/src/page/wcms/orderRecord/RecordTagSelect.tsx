import React, { useEffect, useState } from "react";
import { Select, Divider, Input, Button } from "antd";
import { useApiRequest } from "@/hook";
import { PlusOutlined } from "@ant-design/icons";
import { useOrderRecordTags } from "./OrderRecordTagContext";

const { Option } = Select;

interface RecordTagProps {
  value?: any;
  onChange?: any;
}

export const RecordTagSelect: React.FC<RecordTagProps> = ({
  value,
  onChange,
}) => {
  const tagsContext = useOrderRecordTags();

  const [selectedValue, setSelectedValue] = useState<string[]>([]);

  useEffect(() => {
    if (
      Array.isArray(value) &&
      value[0] &&
      typeof value[0] !== "string" &&
      value[0]["_id"]
    ) {
      const idArrayValue = value.map((item: any) => item._id);
      setSelectedValue(idArrayValue);
      onChange(idArrayValue);
    }
  }, [value]);

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
      tagsContext.refreshTags();
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
      placeholder="选择标签"
      mode="tags"
      allowClear
      value={selectedValue}
      onChange={(selectValue) => {
        setSelectedValue(selectValue);
        onChange(selectValue);
      }}
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
      {tagsContext.tags.map((tagItem: any) => {
        return (
          <Option key={tagItem._id} value={tagItem._id}>
            {`${tagItem.name} (${tagItem.referCount || "0"})`}
          </Option>
        );
      })}
    </Select>
  );
};
