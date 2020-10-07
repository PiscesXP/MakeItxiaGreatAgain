import React, { useState } from "react";
import { Button, Card, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { utcDateToText } from "@/util/time";
import { EditOrderRecordFormModal } from "./EditOrderRecordFormModal";
import { OrderInfoModal } from "./OrderInfoModal";

interface RequireRecordListProps {
  loading: boolean;
  orderList: any[];
  onPostRecord: () => void;
}

export const RequireRecordList: React.FC<RequireRecordListProps> = ({
  loading,
  orderList,
  onPostRecord,
}) => {
  const [editFormVisible, setEditFormVisible] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);

  const [previewOrderID, setPreviewOrderID] = useState<string | null>(null);

  if (loading || orderList?.length === 0) {
    return null;
  }

  function handleEditOrderRecord(order: any) {
    setEditingOrder(order);
    setEditFormVisible(true);
  }

  const columns: ColumnsType = [
    {
      title: "姓名",
      key: "name",
      dataIndex: "name",
    },
    {
      title: "预约日期",
      key: "createTime",
      dataIndex: "createTime",
      render: (value) => <span>{utcDateToText(value)}</span>,
    },
    {
      title: "",
      key: "action",
      render: (value, record: any) => {
        return (
          <>
            <Button
              size="small"
              style={{ marginRight: "10px" }}
              onClick={() => {
                setPreviewOrderID(record._id);
              }}
            >
              查看
            </Button>
            <OrderInfoModal
              visible={record._id === previewOrderID}
              order={record}
              onHide={() => {
                setPreviewOrderID(null);
              }}
            />
            <Button
              type="primary"
              size="small"
              onClick={() => {
                handleEditOrderRecord(record);
              }}
            >
              填写
            </Button>
          </>
        );
      },
    },
  ];

  return (
    <Card title="未记录的预约单" style={{ marginBottom: "8px" }}>
      <Table
        columns={columns}
        dataSource={orderList}
        rowKey="_id"
        size="small"
      />
      <EditOrderRecordFormModal
        visible={editFormVisible}
        onSubmit={onPostRecord}
        onHide={() => {
          setEditFormVisible(false);
          setEditingOrder(null);
        }}
        order={editingOrder}
      />
    </Card>
  );
};
