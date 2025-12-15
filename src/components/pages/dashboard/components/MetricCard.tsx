import { Maximize2 } from "lucide-react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

export interface MetricCardProps {
  title: string;
  value: string;
  unit: string;
  dateRange: string;
  chartData: Array<Record<string, string | number>>;
  dataKey: string;
  color: string;
}

export function MetricCard({
  title,
  value,
  unit,
  dateRange,
  chartData,
  dataKey,
  color,
}: MetricCardProps) {
  return (
    <div className="border rounded-lg p-6 bg-card relative group">
      <button className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <Maximize2 size={16} className="text-muted-foreground" />
      </button>
      <div className="mb-4">
        <h3 className="text-sm font-medium text-muted-foreground mb-1">
          {title}
        </h3>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-semibold text-foreground">
            {unit && unit !== "" ? `${unit} ` : ""}
            {value}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">{dateRange}</p>
      </div>
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.05)"
            />
            <XAxis
              dataKey="date"
              stroke="rgba(255,255,255,0.3)"
              tick={{ fontSize: 11 }}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 11 }} />
            <Tooltip
              contentStyle={{
                background: "rgba(0,0,0,0.9)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "6px",
              }}
              labelStyle={{ color: "#fff", fontSize: "11px" }}
            />
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

