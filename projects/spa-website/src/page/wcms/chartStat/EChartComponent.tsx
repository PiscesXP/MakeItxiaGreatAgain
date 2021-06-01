import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
import { ECBasicOption } from "echarts/types/dist/shared";
import { Card } from "antd";

interface EChartComponentProps {
  options: ECBasicOption;
}

export const EChartComponent: React.FC<EChartComponentProps> = ({
  options,
}) => {
  const domRef = useRef<any>();

  useEffect(() => {
    const myChart = echarts.init(domRef.current);
    myChart.setOption(options);
  }, [domRef, options]);

  return (
    <Card>
      <div ref={domRef} className="echarts-dom" />
    </Card>
  );
};
