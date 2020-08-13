import { Button, Result } from "antd";
import React from "react";
import PropTypes from "prop-types";
import { useTitle } from "HOOK";

function onBack() {
  window.history.back();
}

function NotFound({
  status = "good luck",
  title = "404 Not Found",
  subTitle = "网页不见了.",
  icon = <img src="/img/emoji-han.png" alt="404" />,
  extra = (
    <Button type="primary" onClick={onBack}>
      返回
    </Button>
  )
}) {
  useTitle("WTF - What a Terrible Failure");
  return (
    <Result
      status={status}
      title={title}
      subTitle={subTitle}
      icon={icon}
      extra={extra}
    />
  );
}

NotFound.propTypes = {
  status: PropTypes.string,
  title: PropTypes.string,
  subTitle: PropTypes.string,
  icon: PropTypes.node,
  extra: PropTypes.node
};

export { NotFound };
