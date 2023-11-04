import { FC, useCallback } from "react";
import { ResponsiveContainer, PieChart as PieChartWrapper, Pie, Cell, Legend, Tooltip } from "recharts";

interface IPieChartProps {
  width?: string;
  height?: string;
  data?: { name: string; value: number; color: string | null }[];
}

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
      <PieChartWrapper>
        <Legend layout="vertical" verticalAlign="middle" wrapperStyle={{ right: 40 }} formatter={legendFormatter} />
        <Tooltip formatter={tooltipFormatter} />

        <Pie data={data} dataKey="value" cx="50%" cy="50%" outerRadius={120}>
          {data?.map((entry, index) => (
            <Cell key={index} fill={entry.color ?? "#8884d8"} style={{ outline: "none" }} />
          ))}
        </Pie>
      </PieChartWrapper>
    </ResponsiveContainer>
  );
};
