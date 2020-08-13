import React from "react";
import { Icon, Timeline } from "antd";
import * as timeUtil from "../../util/time";

export default class OrderHistoryTimeline extends React.Component {
  render() {
    const { history } = this.props;
    if (Array.isArray(history)) {
      history.sort((a, b) => a.time - b.time);
    }
    const historyInfo = [];
    historyInfo.push({
      color: "green",
      text: "预约人发起了预约",
      dot: <Icon type="clock-circle" style={{ fontSize: "16px" }} />
    });
    history.forEach(value => {
      let info;
      switch (value.action) {
        case 0:
          info = {
            color: "blue",
            text: `被${value.memberName}接单.`
          };
          break;
        case 1:
          info = {
            color: "gray",
            text: `被${value.memberName}放回.`
          };
          break;
        case 2:
          info = {
            color: "blue",
            text: `预约单已完成.`,
            dot: <Icon type="check-circle" style={{ fontSize: "16px" }} />
          };
          break;
        case 3:
          info = {
            color: "red",
            text: `预约单已被取消.`,
            dot: <Icon type="close-circle" style={{ fontSize: "16px" }} />
          };
          break;
        case 4:
          info = {
            color: "red",
            text: `预约单已被废弃.`,
            dot: <Icon type="delete" style={{ fontSize: "16px" }} />
          };
          break;
        default:
      }
      info.text = info.text + " " + timeUtil.unixToText(value.time);
      historyInfo.push(info);
    });

    return (
      <div>
        <Timeline mode="alternate">
          {historyInfo.map((value, index) => {
            return (
              <Timeline.Item key={index} color={value.color} dot={value.dot}>
                {value.text}
              </Timeline.Item>
            );
          })}
        </Timeline>
      </div>
    );
  }
}
