import React, { useState } from "react";
import { Button, Modal } from "antd";

function MemberActionButtons({ selectedMember, onDisableAccount }) {
  const [loadingDisable, setLoadingDisable] = useState(false);

  function handleClickDisable() {
    //TODO
    Modal.info({
      content: "功能开发中",
      centered: true,
    });
    /*setLoadingDisable(true);
    onDisableAccount().finally(() => {
      setLoadingDisable(false);
    });*/
  }

  function handleAddMember() {
    //TODO
    Modal.info({
      content: "功能开发中",
      centered: true,
    });
  }

  return (
    <div id="member-actions">
      <Button type="primary" onClick={handleAddMember}>
        添加成员
      </Button>
      <Button
        type="danger"
        onClick={handleClickDisable}
        loading={loadingDisable}
        disabled={selectedMember.length === 0}
      >
        禁用账号
      </Button>
    </div>
  );
}
export { MemberActionButtons };
