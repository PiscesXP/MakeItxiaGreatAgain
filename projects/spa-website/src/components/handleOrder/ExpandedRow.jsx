import React from "react";
import { Alert, Collapse, Input } from "antd";
import AttachmentContainer from "./AttachmentContainer";
import "./style.css";

export default function render(record) {
  const { Panel } = Collapse;
  return (
    <div>
      <Collapse defaultActiveKey={["description", "attachments"]}>
        <Panel header="问题描述" key="description">
          <div style={{ maxWidth: "60em" }}>
            <Input.TextArea
              value={record.description}
              autoSize={true}
              className="orderDescription"
            />
          </div>
        </Panel>
        <Panel header="附件" key="attachments">
          {Array.isArray(record.attachments)
            ? record.attachments.length === 0
              ? "无附件."
              : record.attachments.map(attachment => {
                  return (
                    <AttachmentContainer
                      key={attachment._id}
                      payload={attachment}
                    />
                  );
                })
            : null}
        </Panel>
        <Panel header="联系方式" key="contact">
          <span>{record.phone}</span>
          <Alert message="正在考虑把联系方式做成：只有管理员，或接单之后才能查看. (保护隐私)" />
        </Panel>
      </Collapse>
    </div>
  );
}
