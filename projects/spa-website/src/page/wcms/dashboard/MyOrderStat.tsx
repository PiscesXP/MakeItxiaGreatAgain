import React from "react";
import { Card, Col, Row, Statistic } from "antd";
import { Loading } from "@/components/loading";
import { useApiRequest } from "@/hook/useApiRequest";

/**
 * 个人预约单数量统计.
 * */
export const MyOrderStat: React.FC = () => {
  const { code, payload } = useApiRequest({ path: "/stat?mine" });
  if (code !== 0) {
    return <Loading />;
  }
  return (
    <Card>
      <h1>我的预约单</h1>
      <Row>
        <Col span={8}>
          <Statistic
            title="正在处理"
            value={payload["handlingCount"]}
            precision={0}
            valueStyle={{ color: "green" }}
          />
        </Col>
        <Col span={8}>
          <Statistic
            title="已完成"
            value={payload["doneCount"]}
            precision={0}
            valueStyle={{ color: "blue" }}
          />
        </Col>
      </Row>
    </Card>
  );
};
