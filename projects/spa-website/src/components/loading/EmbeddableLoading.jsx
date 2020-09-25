import { Spin } from "antd";
import React from "react";
import PropTypes from "prop-types";
import "./loading.css";

/**
 * 浮动于上方的加载标志.
 * */
function EmbeddableLoading(props) {
  const { loading = false, tip = "加载中...", delay = 0 } = props;
  return (
    <Spin spinning={loading} tip={tip} delay={delay}>
      {props.children}
    </Spin>
  );
}

EmbeddableLoading.propTypes = {
  loading: PropTypes.bool,
  tip: PropTypes.string,
  delay: PropTypes.number,
};

export { EmbeddableLoading };
