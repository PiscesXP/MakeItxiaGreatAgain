import { Spin } from "antd";
import React from "react";
import "./loading.css";

interface EmbeddableLoadingProps {
  loading: boolean;
  tip?: string;
  delay?: number;
}

/**
 * 浮动于上方的加载标志.
 * */
const EmbeddableLoading: React.FC<EmbeddableLoadingProps> = (props) => {
  const { loading = false, tip = "加载中...", delay = 0 } = props;
  return (
    <Spin spinning={loading} tip={tip} delay={delay}>
      {props.children}
    </Spin>
  );
};

export { EmbeddableLoading };
