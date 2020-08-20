import React from "react";
import { Button, Descriptions, Popconfirm } from "antd";
import { AttachmentList } from "COMPONENTS/attachment";
import { parseEnumValue } from "UTIL/enumParser";
import { utcDateToText } from "UTIL/time";
import { MultiLinePlainText } from "COMPONENTS/text";

const { Item } = Descriptions;

function OrderInfoCard(props) {
  const { data } = props;
  const {
    name,
    campus,
    createTime,
    phone,
    email,
    qq,
    brandModel,
    os,
    warranty,
    description,
    attachments,
    status,
  } = data;

  const { onCancel, onBackHome, onShowReply } = props;

  return (
    <Descriptions bordered column={1}>
      <Item label="姓名">{name}</Item>
      <Item label="校区">{parseEnumValue(campus)}</Item>
      <Item label="电话">{phone}</Item>
      <Item label="QQ">{qq}</Item>
      <Item label="邮箱">{email}</Item>
      <Item label="电脑型号">{brandModel}</Item>
      <Item label="操作系统">{os}</Item>
      <Item label="保修状况">{warranty}</Item>
      <Item label="预约时间">{utcDateToText(createTime)}</Item>
      <Item label="问题描述">
        <MultiLinePlainText content={description} />
      </Item>
      <Item label="附件">
        {attachments.length === 0 ? (
          "无"
        ) : (
          <AttachmentList data={attachments} />
        )}
      </Item>
      <Item label="操作">
        {status === "PENDING" || status === "HANDLING" ? (
          <Button
            type="primary"
            onClick={onShowReply}
            style={{ marginRight: "16px" }}
          >{`回复消息(${data.reply.length}条)`}</Button>
        ) : null}
        {status === "PENDING" ? (
          <Popconfirm
            title="确定要取消吗?"
            okText="确定"
            cancelText="不了"
            onConfirm={onCancel}
          >
            <Button type="danger">取消预约</Button>
          </Popconfirm>
        ) : null}
        {status === "DONE" ? (
          <Button type="primary" onClick={onBackHome}>
            返回主页
          </Button>
        ) : null}
        {status === "CANCELED" ? (
          <Button type="primary" onClick={onBackHome}>
            返回主页 / 重新预约
          </Button>
        ) : null}
        {status === "HANDLING" ? "预约单处理中..." : null}
      </Item>
    </Descriptions>
  );
}

export { OrderInfoCard };
