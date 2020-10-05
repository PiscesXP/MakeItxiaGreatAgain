import React from "react";
import { CenterMeFlex } from "@/components/layout";
import { Button, Typography } from "antd";
import { useApiRequest } from "@/hook/useApiRequest";

interface ResetPasswordProps {
  member: any;
}

export const ResetPassword: React.FC<ResetPasswordProps> = ({ member }) => {
  const { code, loading, payload, sendRequest } = useApiRequest({
    path: `/member/${member._id}/password`,
    method: "POST",
    manual: true,
    popModal: {
      onFail: true,
      onError: true,
    },
  });

  function handleResetPassword() {
    sendRequest();
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
};
