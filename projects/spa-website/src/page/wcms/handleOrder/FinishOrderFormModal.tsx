import React from "react";
import { Form, Modal, Radio } from "antd";

interface FinishOrderFormModalProps {
  visible: boolean;
  onHide: () => void;
}

export const FinishOrderFormModal: React.FC<FinishOrderFormModalProps> = ({
  visible,
  onHide,
}) => {
  return (
    <Modal visible={visible} okText="提交记录" cancelText="暂不填写">
      <Form>
        <Form.Item name="isActuallyHandled" label="是否已处理">
          <Radio.Group>
            <Radio value={true}>我已处理</Radio>
            <Radio value={false}>未处理</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
};
