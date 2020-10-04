import { Button, Result } from "antd";
import React from "react";
import { useHistory } from "react-router-dom";
import { routePath } from "@/page/routePath";
import { useTitle } from "@/hook/useTitle";

export const PageNotFound: React.FC = () => {
  useTitle("WTF - What a Terrible Failure");

  const history = useHistory();

  function goBack() {
    if (history.length <= 1) {
      history.replace(routePath.CUSTOM);
    } else {
      history.goBack();
    }
  }

  return (
    <Result
      status={"error"}
      title="404 Not Found"
      subTitle="网页不见了"
      icon={<img src="/img/emoji-han.png" alt="404" />}
      extra={
        <Button type="primary" onClick={goBack}>
          返回
        </Button>
      }
    />
  );
};
