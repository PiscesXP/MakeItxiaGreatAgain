import React from "react";
import { MenuOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Table } from "antd";
import {
  sortableContainer,
  sortableElement,
  sortableHandle,
} from "react-sortable-hoc";
import arrayMove from "array-move";
import "./table.css";
import { EmbeddableLoading, Loading } from "COMPONENTS/loading";
import { utcDateToText } from "UTIL/time";

const DragHandle = sortableHandle(() => (
  <MenuOutlined style={{ cursor: "pointer", color: "#999" }} />
));

const SortableItem = sortableElement((props) => <tr {...props} />);
const SortableContainer = sortableContainer((props) => <tbody {...props} />);

/**
 * @param code {number}
 * @param loading {boolean}
 * @param data {[*]} 公告数据
 * @param editingAnnounceID {string|null}
 * @param onReorderAnnounce {function}
 * @param onDeleteAnnounce {function}
 * @param onStartEditingAnnounce {function}
 * */
function AnnouncementTable({
  code,
  loading,
  data = null,
  editingAnnounceID = null,
  onReorderAnnounce,
  onDeleteAnnounce,
  onStartEditingAnnounce,
}) {
  if (code !== 0) {
    return <Loading />;
  }

  const onSortEnd = ({ oldIndex, newIndex }) => {
    if (oldIndex !== newIndex) {
      const newData = arrayMove([].concat(data), oldIndex, newIndex).filter(
        (el) => !!el
      );
      //改变旧数据
      onReorderAnnounce(newData);
    }
  };

  const DraggableBodyRow = ({ className, style, ...restProps }) => {
    const index = data.findIndex((x) => x._id === restProps["data-row-key"]);
    //正在编辑时，禁用拖拽
    const disabled = !!editingAnnounceID;
    return <SortableItem index={index} disabled={disabled} {...restProps} />;
  };

  const DraggableContainer = (props) => (
    <SortableContainer
      useDragHandle
      helperClass="row-dragging"
      onSortEnd={onSortEnd}
      {...props}
    />
  );

  const tableColumns = [
    {
      title: "",
      dataIndex: "order",
      width: 30,
      className: "drag-visible",
      render: () => <DragHandle />,
    },
    {
      title: "公告类型",
      dataIndex: "type",
      render: (type) => {
        if (type === "INTERNAL") {
          return "后台管理";
        } else if (type === "EXTERNAL") {
          return "预约系统";
        }
        return null;
      },
      className: "drag-visible",
    },
    {
      title: "标题",
      dataIndex: "title",
      className: "drag-visible",
    },
    {
      title: "时间",
      dataIndex: "createTime",
      render: (createTime) => {
        return <span>{utcDateToText(createTime)}</span>;
      },
    },
    {
      title: "操作",
      dataIndex: "_id",
      render: (_id) => {
        if (editingAnnounceID) {
          if (editingAnnounceID === _id) {
            return (
              <Button
                onClick={() => {
                  onStartEditingAnnounce(null);
                }}
                type="danger"
              >
                取消编辑
              </Button>
            );
          } else {
            return null;
          }
        }

        return (
          <>
            <Button
              onClick={() => {
                onStartEditingAnnounce(_id);
              }}
              style={{ marginRight: "1em" }}
            >
              修改
            </Button>
            <Popconfirm
              title="确定要删除此公告吗?"
              okText="确定"
              cancelText="取消"
              onConfirm={() => {
                onDeleteAnnounce(_id);
              }}
            >
              <Button type="danger">删除</Button>
            </Popconfirm>
          </>
        );
      },
    },
  ];

  return (
    <EmbeddableLoading loading={loading}>
      <Table
        pagination={false}
        dataSource={data}
        columns={tableColumns}
        rowKey="_id"
        components={{
          body: {
            wrapper: DraggableContainer,
            row: DraggableBodyRow,
          },
        }}
      />
    </EmbeddableLoading>
  );
}

export { AnnouncementTable };
