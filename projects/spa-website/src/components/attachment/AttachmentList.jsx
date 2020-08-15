import React from "react";
import { Attachment } from "COMPONENTS/attachment/Attachment";

/**
 * 附件列表.
 * @param data {[Object]} 附件列表数据
 * */
function AttachmentList({ data }) {
  return (
    <div className="attachment-list">
      {data.map((value) => {
        return <Attachment key={value._id} data={value} />;
      })}
    </div>
  );
}

export { AttachmentList };
