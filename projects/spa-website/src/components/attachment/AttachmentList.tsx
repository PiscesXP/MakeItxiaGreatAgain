import React from "react";
import { Attachment } from "./Attachment";

interface AttachmentListProps {
  data: any[];
}

/**
 * 附件列表.
 * @param data {[Object]} 附件列表数据
 * */
export const AttachmentList: React.FC<AttachmentListProps> = ({ data }) => {
  return (
    <div className="attachment-list">
      {data.map((value) => {
        return <Attachment key={value._id} data={value} />;
      })}
    </div>
  );
};
