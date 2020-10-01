import React from "react";
import { MenuOutlined } from "@ant-design/icons";
import { Button, Popconfirm, Table } from "antd";
import * as ReactSortableHoc from "react-sortable-hoc";
import arrayMove from "array-move";
import { EmbeddableLoading, Loading } from "@/components/loading";
import { utcDateToText } from "@/util/time";
import { AnnouncementType } from "@/util/enum";
import "./table.css";

const DragHandle = ReactSortableHoc.SortableHandle(() => (
  <MenuOutlined style={{ cursor: "pointer", color: "#999" }} />
));

const SortableItem = ReactSortableHoc.SortableElement((props: any) => (
  <tr {...props} />
));
const SortableContainer = ReactSortableHoc.SortableContainer((props: any) => (
  <tbody {...props} />
));

interface AnnouncementTableProps {
  loading: boolean;
  //公告信息
  data: any;
  //正在编辑的公告ID
  editingAnnounceID?: string | null;
  //更改公告列表的排序
  onChangeAnnounceOrder: (dataArray: any[]) => void;
  //删除公告
  onDeleteAnnounce: (announceID: string) => void;
  //设置正在编辑的公告
  onEditAnnounce: (announceID?: string | null) => void;
}

/**
 * 公告表格.
 * 展示公告标题、顺序、编辑按钮等等.
 * */
export const AnnouncementTable: React.FC<AnnouncementTableProps> = ({
  loading,
  data,
  editingAnnounceID = null,
  onChangeAnnounceOrder,
  onDeleteAnnounce,
  onEditAnnounce,
}) => {
  if (!data) {
    return <Loading />;
  }

  const onSortEnd = ({ oldIndex, newIndex }: any) => {
    if (oldIndex !== newIndex) {
      const newData = arrayMove([].concat(data), oldIndex, newIndex).filter(
        (el) => !!el
      );
      //改变旧数据
      onChangeAnnounceOrder(newData);
    }
  };

  const DraggableBodyRow = ({ className, style, ...restProps }: any) => {
    const index = data.findIndex(
      (x: any) => x._id === restProps["data-row-key"]
    );
    //正在编辑时，禁用拖拽
    const disabled = !!editingAnnounceID;
    return <SortableItem index={index} disabled={disabled} {...restProps} />;
  };

  const DraggableContainer = (props: any) => (
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
      render: (type: AnnouncementType) => {
        if (type === AnnouncementType.INTERNAL) {
          return "后台管理";
        } else if (type === AnnouncementType.EXTERNAL) {
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
      render: (createTime: any) => {
        return <span>{utcDateToText(createTime)}</span>;
      },
    },
    {
      title: "操作",
      dataIndex: "_id",
      render: (_id: string) => {
        if (editingAnnounceID) {
          if (editingAnnounceID === _id) {
            return (
              <Button
                onClick={() => {
                  onEditAnnounce(null);
                }}
                type="primary"
                danger
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
                onEditAnnounce(_id);
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
              <Button type="primary" danger>
                删除
              </Button>
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
};
