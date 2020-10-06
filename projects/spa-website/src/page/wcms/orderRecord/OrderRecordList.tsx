import React from "react";
import { List, Space } from "antd";
import { MessageOutlined, LikeOutlined, StarOutlined } from "@ant-design/icons";
import { MultiLinePlainText } from "@/components/text";
import { AttachmentList } from "@/components/attachment";

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

const IconText = ({ icon, text }: any) => (
  <Space>
    {React.createElement(icon)}
    {text}
  </Space>
);

interface OrderRecordListProps {
  loading: boolean;
  payload: any;
  onPaginationChange: () => void;
}

export const OrderRecordList: React.FC<OrderRecordListProps> = ({
  loading,
  payload,
}) => {
  const { data, pagination } = payload || {};

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
      renderItem={(item: any) => {
        console.log(item);

        const likeByCount = item.likeBy.length;
        const starByCount = item.starBy.length;
        const commentsCount = item.comments.length;

        return (
          <List.Item
            key={item._id}
            actions={[
              <IconText
                icon={StarOutlined}
                text={starByCount}
                key="list-vertical-star-o"
              />,
              <IconText
                icon={LikeOutlined}
                text={likeByCount}
                key="list-vertical-like-o"
              />,
              <IconText
                icon={MessageOutlined}
                text={commentsCount}
                key="list-vertical-message"
              />,
            ]}
          >
            <List.Item.Meta
              title={item.title}
              description={`Post by ${item.author.realName}`}
            />
            <MultiLinePlainText content={item.content} />
            <AttachmentList data={item.attachments} />
          </List.Item>
        );
      }}
    />
  );
};
