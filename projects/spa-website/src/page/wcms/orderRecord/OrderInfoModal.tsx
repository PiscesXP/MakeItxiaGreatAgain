import React from "react";
import { parseEnumValue } from "@/util/enum";
import { utcDateToText } from "@/util/time";
import { MultiLinePlainText } from "@/components/text";
import { AttachmentList } from "@/components/attachment";
import { Descriptions, Modal } from "antd";

const { Item } = Descriptions;

interface OrderInfoModalProps {
  visible: boolean;
  order: any;
  onHide: () => void;
}

export const OrderInfoModal: React.FC<OrderInfoModalProps> = ({
  visible,
  order,
  onHide,
}) => {
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
  } = order;

  return (
    <Modal
      title={`${name} 的预约单`}
      centered
      visible={visible}
      footer={null}
      onCancel={onHide}
    >
      <Descriptions bordered column={1}>
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
        <Item label="电脑型号">{brandModel}</Item>
        <Item label="操作系统">{os}</Item>
        <Item label="姓名">{name}</Item>
        <Item label="保修状况">{warranty}</Item>
        <Item label="预约时间">{utcDateToText(createTime)}</Item>
        <Item label="校区">{parseEnumValue(campus)}</Item>
        <Item label="电话">{phone}</Item>
        <Item label="QQ">{qq}</Item>
        <Item label="邮箱">{email}</Item>
      </Descriptions>
    </Modal>
  );
};
