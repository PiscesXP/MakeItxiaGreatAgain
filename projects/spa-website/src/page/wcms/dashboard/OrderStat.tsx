import React from "react";
import { Card, Col, Divider, Row, Statistic } from "antd";
import { Loading } from "@/components/loading";
import * as timeUtil from "@/util/time";
import { useApiRequest } from "@/hook/useApiRequest";

export const OrderStat: React.FC = () => {
  const { code, payload: data } = useApiRequest({ path: "/stat" });
  if (code !== 0) {
    return <Loading />;
  }
  return (
    <Card>
      <h1>预约单统计</h1>
      <Row>
        <Col span={8}>
          <Statistic
            title="等待处理"
            value={data["pendingCount"]}
            precision={0}
            valueStyle={{ color: "red" }}
          />
        </Col>
        <Col span={8}>
          <Statistic
            title="正在处理"
            value={data["handlingCount"]}
            precision={0}
            valueStyle={{ color: "green" }}
          />
        </Col>
        <Col span={8}>
          <Statistic
            title="已完成"
            value={data["doneCount"]}
            precision={0}
            valueStyle={{ color: "blue" }}
          />
        </Col>
      </Row>
      <Divider />
      <h1>{"积压的预约单(>14天未处理)"} </h1>
      <Row>
        <Col span={8}>
          <Statistic
            title="仙林"
            value={data["backlogXianlin"]}
            precision={0}
            valueStyle={{ color: "red" }}
          />
        </Col>
        <Col span={8}>
          <Statistic
            title="鼓楼"
            value={data["backlogGulou"]}
            precision={0}
            valueStyle={{ color: "red" }}
          />
        </Col>
      </Row>
      <span style={{ float: "right", fontSize: "0.5rem" }}>
        统计更新时间：{timeUtil.utcDateToText(data.updateTime)}
      </span>
    </Card>
  );
};
