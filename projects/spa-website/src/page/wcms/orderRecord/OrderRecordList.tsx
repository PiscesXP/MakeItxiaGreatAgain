import React, { useState } from "react";
import { List, message, Space, Tag } from "antd";
import {
  CalendarOutlined,
  LikeOutlined,
  LikeTwoTone,
  MessageOutlined,
  StarOutlined,
  StarTwoTone,
} from "@ant-design/icons";
import { MultiLinePlainText } from "@/components/text";
import { AttachmentList } from "@/components/attachment";
import { utcDateToText } from "@/util/time";
import { PUT } from "@/request/api";
import { ApiRequestStateEnum } from "@/request/types";
import { useMemberContext } from "@/hook";
import { ReplyList } from "@/components/reply";
import { OrderInfoModal } from "@/page/wcms/orderRecord/OrderInfoModal";

const listData: any[] | undefined = [];
for (let i = 0; i < 23; i++) {
  listData.push({
    href: "https://ant.design",
    title: `ant design part ${i}`,
    avatar: "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png",
    description:
      "Ant Design, a design language for background applications, is refined by Ant UED Team.",
    content:
      "We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.",
  });
}

const IconText = ({ icon, text, onClick }: any) => (
  <div onClick={onClick}>
    <Space>
      {React.createElement(icon)}
      {text}
    </Space>
  </div>
);

const TagList = ({ tags }: { tags: { _id: string; name: string }[] }) => (
  <div>
    {tags.map((value) => (
      <Tag id={value._id}>{value.name}</Tag>
    ))}
  </div>
);
interface OrderRecordListProps {
  loading: boolean;
  payload: any;
  onPaginationChange: () => void;
  refresh: () => void;
}

export const OrderRecordList: React.FC<OrderRecordListProps> = ({
  loading,
  payload,
  refresh,
}) => {
  const { data, pagination } = payload || {};

  const [replyModalID, setReplyModalID] = useState<string | null>(null);

  const [orderInfoModalID, setOrderInfoModalID] = useState<string | null>(null);

  const memberContext = useMemberContext();

  function handleClickStar(recordID: string, isUndo: boolean) {
    PUT(`/orderRecord/${recordID}/${isUndo ? "unstar" : "star"}`)
      .then((result) => {
        if (result.state === ApiRequestStateEnum.success) {
          message.success({
            content: isUndo ? "取消收藏" : "收藏成功",
            duration: 1.5,
          });
        }
      })
      .finally(() => {
        refresh();
      });
  }

  function handleClickLike(recordID: string, isUndo: boolean) {
    PUT(`/orderRecord/${recordID}/${isUndo ? "unlike" : "like"}`).finally(
      () => {
        refresh();
      }
    );
  }

  return (
    <List
      itemLayout="vertical"
      size="large"
      pagination={{
        onChange: (page) => {
          console.log(page);
        },
        pageSize: 5,
      }}
      dataSource={data || []}
      renderItem={(record: any) => {
        console.log(record);

        const likeByCount = record.likeBy.length;
        const didILike = record.likeBy.some((value: any) => {
          return value._id === memberContext._id;
        });

        const starByCount = record.starBy.length;
        const didIStar = record.starBy.some((value: any) => {
          return value._id === memberContext._id;
        });

        const commentsCount = record.comments.length;

        return (
          <List.Item
            key={record._id}
            actions={[
              <IconText
                icon={CalendarOutlined}
                text="预约单"
                key="order"
                onClick={() => {
                  setOrderInfoModalID(record._id);
                }}
              />,
              <IconText
                icon={didIStar ? StarTwoTone : StarOutlined}
                text={starByCount}
                key="star"
                onClick={() => {
                  handleClickStar(record._id, didIStar);
                }}
              />,
              <IconText
                icon={didILike ? LikeTwoTone : LikeOutlined}
                text={likeByCount}
                key="like"
                onClick={() => {
                  handleClickLike(record._id, didILike);
                }}
              />,
              <IconText
                icon={MessageOutlined}
                text={commentsCount}
                key="comments"
                onClick={() => {
                  setReplyModalID(record._id);
                }}
              />,
            ]}
          >
            <List.Item.Meta
              title={record.title}
              description={`${record.author.realName} 发布于 ${utcDateToText(
                record.createTime
              )}`}
            />
            <TagList tags={record.tags} />
            <br />
            <MultiLinePlainText content={record.content} />
            <AttachmentList data={record.attachments} />
            <ReplyList
              visible={replyModalID === record._id}
              title="评论区"
              onCancel={() => {
                setReplyModalID(null);
              }}
              data={record.comments}
              postUrl={`/orderRecord/${record._id}/comments`}
              onReply={() => {
                refresh();
              }}
            />
            <OrderInfoModal
              visible={orderInfoModalID === record._id}
              order={record.order}
              onHide={() => {
                setOrderInfoModalID(null);
              }}
            />
          </List.Item>
        );
      }}
    />
  );
};
