import React from "react";
import { Card, Col, Icon, List, Row, Tag } from "antd";
import { CenterMeResponsive } from "COMPONENTS/layout";
import {
  useLocalStorageState,
  useMemberContext,
  useTitleWCMS,
} from "HOOK/index";
import { ExpSearchCondition } from "PAGE/wcms/exp/ExpSearchCondition";

const mockData = {
  writer: {
    _id: "123456",
    realName: "洛天依",
  },
  title: "MacBook维修",
  content: `MacBook拆后盖容易翻车.`,
};

const payload = [];

for (let i = 0; i < 20; i++) {
  payload.push({ _id: i, ...mockData });
}
const IconText = ({ type, text }) => (
  <span>
    <Icon type={type} style={{ marginRight: 8 }} />
    {text}
  </span>
);
function ExpPage() {
  useTitleWCMS("经验记录");
  const memberContext = useMemberContext();
  const condition = useLocalStorageState("expSearchCondition", {
    onlyMine: false,
    campus: memberContext.campus,
    status: "PENDING",
    text: "",
    orderTime: null,
  });

  return (
    <CenterMeResponsive>
      <Row gutter={[16, 16]}>
        <Col md={24} lg={9}>
          <Card title="我的记录" />
          <div style={{ margin: "16px" }} />
          <ExpSearchCondition condition={condition} />
        </Col>
        <Col md={24} lg={15}>
          <Card>
            <List
              itemLayout="vertical"
              dataSource={payload}
              renderItem={(item) => {
                return (
                  <List.Item
                    key={item._id}
                    actions={[
                      <IconText
                        type="star-o"
                        text="156"
                        key="list-vertical-star-o"
                      />,
                      <IconText
                        type="like-o"
                        text="156"
                        key="list-vertical-like-o"
                      />,
                      <IconText
                        type="message"
                        text="2"
                        key="list-vertical-message"
                      />,
                    ]}
                  >
                    <List.Item.Meta
                      title={item.title}
                      description={`张震曦 编辑于 ${new Date().toUTCString()}`}
                    />
                    <Tag>翻车</Tag>
                    <Tag>MacBook</Tag>
                    <p />
                    {item.content}
                  </List.Item>
                );
              }}
            />
          </Card>
        </Col>
      </Row>
    </CenterMeResponsive>
  );
}

export { ExpPage };
