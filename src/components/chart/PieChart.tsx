import { FC, useCallback } from "react";
import { ResponsiveContainer, PieChart as PieChartWrapper, Pie, Cell, Legend, Tooltip } from "recharts";

type PieLabelProps = {
  color: string;
  cornerRadius: undefined;
  cx: number;
  cy: number;
  endAngle: number;
  fill: string;
  index: number;
  innerRadius: number;
  maxRadius: number;
  midAngle: number;
  middleRadius: number;
  name: string;
  outerRadius: number;
  paddingAngle: number;
  percent: number;
  startAngle: number;
  stroke: string;
  style: { outline: string };
  textAnchor: string;
  value: number;
  x: number;
  y: number;
};

interface IPieChartProps {
  width?: string;
  height?: string;
  data?: { name: string; value: number; color: string | null }[];
}

const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: PieLabelProps) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export const PieChart: FC<IPieChartProps> = ({ width = "100%", height = "300px", data }) => {
  const tooltipFormatter = useCallback((data: string | number) => {
    if (typeof data === "number") {
      return data.toLocaleString();
    }

    return data;
  }, []);

  const legendFormatter = useCallback((data: string) => {
    if (typeof data === "string") {
      return data.toUpperCase();
    }

    return data;
  }, []);

  return (
    <ResponsiveContainer width={width} minHeight={height}>
      <PieChartWrapper margin={{ right: 160 }}>
        <Legend layout="vertical" verticalAlign="middle" wrapperStyle={{ right: 80 }} formatter={legendFormatter} />
        <Tooltip formatter={tooltipFormatter} />

        <Pie
          data={data}
          dataKey="value"
          cx="50%"
          cy="50%"
          outerRadius={120}
          labelLine={false}
          label={renderCustomizedLabel}
        >
          {data?.map((entry, index) => (
            <Cell key={index} fill={entry.color ?? "#8884d8"} style={{ outline: "none" }} />
          ))}
        </Pie>
      </PieChartWrapper>
    </ResponsiveContainer>
  );
};
