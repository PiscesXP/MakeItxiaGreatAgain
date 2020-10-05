import { Spin } from "antd";
import React from "react";
import "./loading.css";

interface LoadingProps {
  tip?: string;
  delay?: number;
}

export const Loading: React.FC<LoadingProps> = ({
  tip = "加载中...",
  delay = 500,
}) => {
  return (
    <div className="loading">
      <Spin tip={tip} delay={delay} />
    </div>
  );
};
