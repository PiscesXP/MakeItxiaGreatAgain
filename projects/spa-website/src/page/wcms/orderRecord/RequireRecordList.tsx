import React, { useState } from "react";
import { Loading } from "@/components/loading";
import { Button, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { utcDateToText } from "@/util/time";
import { EditOrderRecordFormModal } from "@/page/wcms/orderRecord/EditOrderRecordFormModal";

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

  if (loading) {
    return <Loading />;
  }

  if (orderList.length === 0) {
    return <span>暂无</span>;
  }

  function handleViewOrder() {
    //TODO
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
      render: (value, record) => {
        return (
          <>
            <Button
              size="small"
              style={{ marginRight: "6px" }}
              onClick={handleViewOrder}
            >
              查看
            </Button>
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
    <>
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
    </>
  );
};
