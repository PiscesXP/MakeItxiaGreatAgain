import React from "react";
import { useApiRequest, useTitleWCMS } from "@/hook";
import { Loading } from "@/components/loading";
import "./chartStat.css";
import { EChartComponent } from "./EChartComponent";

export const ChartStat = () => {
  useTitleWCMS("统计信息");

  const { loading, payload } = useApiRequest({
    path: "/itxiaStat/charts",
  });

  if (loading) {
    return <Loading />;
  }

  function makeOrderCountsByDateOptions(isByDay = true) {
    const data = isByDay
      ? payload["orderCountsByDay"]
      : payload["orderCountsByMonth"];
    return {
      title: {
        text: isByDay ? "每日预约量统计" : "月度预约量统计",
        left: "center",
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
          label: {
            show: true,
          },
        },
      },
      toolbox: {
        show: true,
        feature: {
          mark: { show: true },
          dataView: { show: true, readOnly: false },
          magicType: isByDay ? null : { show: true, type: ["line", "bar"] },
          restore: isByDay ? null : { show: true },
          saveAsImage: { show: true },
        },
      },
      legend: {
        data: ["鼓楼", "仙林", "全部"],
        top: 32,
        selected: {
          鼓楼: true,
          仙林: true,
          全部: !isByDay,
        },
      },
      xAxis: {
        type: "category",
        data: data["dateList"],
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          name: "鼓楼",
          type: "bar",
          data: data["guLou"],
          smooth: true,
        },
        {
          name: "仙林",
          type: "bar",
          data: data["xianLin"],
          smooth: true,
        },
        {
          name: "全部",
          type: "bar",
          data: data["guLou"].map((value: number, index: number) => {
            return data["xianLin"][index] + value;
          }),
          smooth: true,
          show: false,
        },
      ],
      dataZoom: [
        {
          type: "inside",
          start: isByDay ? 98 : 50,
          end: 100,
        },
        {
          start: 0,
          end: 100,
        },
      ],
    };
  }

  const orderCountsByDayOptions = makeOrderCountsByDateOptions();
  const orderCountsByMonthOptions = makeOrderCountsByDateOptions(false);

  const tagStatOptions = {
    title: {
      text: "经验记录标签统计",
      left: "center",
    },
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b} : {c} ({d}%)",
    },
    legend: {
      type: "scroll",
      orient: "vertical",
      right: 20,
      top: 10,
      bottom: 10,
      data: payload["expTags"]["tagNameList"],

      selected: [],
    },
    series: [
      {
        name: "经验记录标签",
        type: "pie",
        radius: "55%",
        center: ["40%", "50%"],
        data: payload["expTags"]["tagNameList"].map(
          (value: string, index: number) => {
            return {
              name: value,
              value: payload["expTags"]["tagCountList"][index],
            };
          }
        ),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  };

  return (
    <div className="charts-container">
      <EChartComponent options={orderCountsByDayOptions} />
      <EChartComponent options={orderCountsByMonthOptions} />
      <EChartComponent options={tagStatOptions} />
    </div>
  );
};
