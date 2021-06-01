import React from "react";
import { useApiRequest, useTitleWCMS } from "@/hook";
import { Loading } from "@/components/loading";
import "./chartStat.css";
import { EChartComponent } from "./EChartComponent";
import { Alert, Card } from "antd";
import { CenterMeFlex } from "@/components/layout";
import { utcDateToText } from "@/util/time";

function sumArray(...arrays: [number][]) {
  const size = arrays[0].length;
  const result = [];
  for (let i = 0; i < size; i++) {
    let sum = 0;
    arrays.forEach((arr) => {
      sum += arr[i];
    });
    result[i] = sum;
  }
  return result;
}

function calcMA(array: [number], count: number) {
  const length = array.length;
  const half = count / 2;

  return array.map((value, index, arr) => {
    const begin = index - half,
      end = begin + count;
    if (begin < 0 || end >= length) {
      return null;
    }
    let sum = 0;
    for (let i = begin; i < end; i++) {
      sum += arr[i];
    }
    return (sum / count).toFixed(2);
  });
}

export const ChartStat = () => {
  useTitleWCMS("统计信息");

  const { loading, payload } = useApiRequest({
    path: "/itxiaStat/charts",
    formatResult: (result) => {
      const byDay = result["orderCountsByDay"];
      byDay["total"] = sumArray(byDay["guLou"], byDay["xianLin"]);
      byDay["guLouAvg14"] = calcMA(byDay["guLou"], 14);
      byDay["xianLinAvg14"] = calcMA(byDay["xianLin"], 14);
      byDay["totalAvg14"] = calcMA(byDay["total"], 14);

      const byMonth = result["orderCountsByMonth"];
      byMonth["total"] = sumArray(byMonth["guLou"], byMonth["xianLin"]);
      return result;
    },
  });

  if (loading) {
    return <Loading />;
  }

  function makeOrderCountsByDateOptions(isByDay = true) {
    const data = isByDay
      ? payload["orderCountsByDay"]
      : payload["orderCountsByMonth"];

    const basicOption = {
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
          magicType: { show: true, type: ["line", "bar"] },
          restore: { show: true },
          saveAsImage: { show: true },
        },
      },
      xAxis: {
        type: "category",
        data: data["dateList"],
      },
      yAxis: {
        type: "value",
      },
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

    if (isByDay) {
      return {
        ...basicOption,
        legend: {
          data: [
            "鼓楼",
            "仙林",
            "鼓楼-平均14天",
            "仙林-平均14天",
            "全部",
            "全部-平均14天",
          ],
          top: 32,
          selected: {
            鼓楼: true,
            仙林: true,
            "全部-平均14天": true,
            "鼓楼-平均14天": false,
            "仙林-平均14天": false,
            全部: false,
          },
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
            name: "全部-平均14天",
            type: "line",
            data: data["totalAvg14"],
            smooth: true,
            show: false,
            // color: "#e3b30d",
          },
          {
            name: "鼓楼-平均14天",
            type: "line",
            data: data["guLouAvg14"],
            smooth: true,
            show: false,
            // color: "#69efb9",
          },
          {
            name: "仙林-平均14天",
            type: "line",
            data: data["xianLinAvg14"],
            smooth: true,
            show: false,
          },
          {
            name: "全部",
            type: "bar",
            data: data["total"],
            smooth: true,
            show: false,
            color: "#e78823",
          },
        ],
      };
    } else {
      return {
        ...basicOption,
        legend: {
          data: ["鼓楼", "仙林", "全部"],
          top: 32,
          selected: {
            鼓楼: true,
            仙林: true,
            全部: false,
          },
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
            data: data["total"],
            smooth: true,
            show: false,
          },
        ],
      };
    }
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
    toolbox: {
      show: true,
      feature: {
        dataView: { show: true, readOnly: false },
        restore: { show: true },
        saveAsImage: { show: true },
      },
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
      <Card>
        <Alert type="info" message="图表功能测试中，欢迎提出修改意见😊。" />
        <br />
        <Alert
          type="warning"
          message="预约单数据仍存在一些重复(统计出来可能有200-300单😳)，因此数据和实际值会有一些偏差。后续将会把这些重复单子删除，部分同学的预约单统计数据将会减少。"
        />
      </Card>
      <EChartComponent options={orderCountsByDayOptions} />
      <EChartComponent options={orderCountsByMonthOptions} />
      <EChartComponent options={tagStatOptions} />
      <CenterMeFlex>
        <span>统计更新时间：{utcDateToText(payload["updateTime"])}</span>
      </CenterMeFlex>
    </div>
  );
};
