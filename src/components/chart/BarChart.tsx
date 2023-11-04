import { FC, PropsWithChildren, useCallback } from "react";
import {
  BarChart as BarChartWrapper,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export type BarChartEvent = {
  activeCoordinate?: { x: number; y: number };
  activeLabel?: string;
  activePayload?: {
    chartType?: string;
    color: string;
    dataKey: string;
    fill: string;
    formatter?: any;
    name: string;
    payload?: Record<string, string | number>[];
  }[];
  activeTooltipIndex?: number;
  chartX?: number;
  chartY?: number;
};

interface IBarChartProps {
  width?: string;
  height?: string;
  data?: { name: string }[];
  onClick?: (e: BarChartEvent) => void;
}

export const BarChart: FC<PropsWithChildren<IBarChartProps>> = ({
  width = "100%",
  height = "300px",
  data,
  onClick,
  children,
}) => {
  const yAxisFormatter = useCallback((data: string | number) => {
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

  const tooltipFormatter = useCallback((data: string | number) => {
    if (typeof data === "number") {
      return data.toLocaleString();
    }

    return data;
  }, []);

  return (
    <ResponsiveContainer width={width} minHeight={height}>
      <BarChartWrapper data={data} barSize={20} margin={{ top: 50, right: 5, left: 5, bottom: 0 }} onClick={onClick}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" tick={{ fontSize: "14px" }} />
        <YAxis tick={{ fontSize: "14px" }} tickFormatter={yAxisFormatter} />
        <Legend wrapperStyle={{ top: 0 }} formatter={legendFormatter} />
        <Tooltip formatter={tooltipFormatter} />

        {children}
      </BarChartWrapper>
    </ResponsiveContainer>
  );
};
