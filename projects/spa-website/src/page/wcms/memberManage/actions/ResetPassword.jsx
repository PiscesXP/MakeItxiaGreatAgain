import React from "react";
import { useApi } from "HOOK/index";
import { CenterMeFlex } from "COMPONENTS/layout";
import { Button, Modal, Typography } from "antd";

function ResetPassword({ member }) {
  const { code, loading, payload, send } = useApi({
    path: `/member/${member && member._id}/password`,
    method: "POST",
    later: true,
    onFail: ({ message }) => {
      Modal.error({
        title: "重置失败",
        content: message,
        centered: true,
      });
    },
  });

  function handleResetPassword() {
    send();
  }

  return (
    <CenterMeFlex>
      {code === 0 ? (
        <div>
          <span>新密码: </span>
          <Typography.Text copyable>{payload}</Typography.Text>
        </div>
      ) : (
        <Button type="primary" loading={loading} onClick={handleResetPassword}>
          重置密码
        </Button>
      )}
    </CenterMeFlex>
  );
}

export { ResetPassword };
