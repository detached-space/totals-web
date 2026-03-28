import { AreaChart, Area, ResponsiveContainer } from "recharts";

interface SparklineChartProps {
    data: number[];
    color?: string;
    height?: number;
    showArea?: boolean;
}

export default function SparklineChart({ data, color = "var(--accent)", height = 40, showArea = true }: SparklineChartProps) {
    const chartData = data.map((v, i) => ({ i, v }));

    return (
        <div style={{ height }} className="w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                    {showArea && (
                        <defs>
                            <linearGradient id={`spark-${color.replace(/[^a-z0-9]/gi, '')}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={color} stopOpacity={0.2} />
                                <stop offset="100%" stopColor={color} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                    )}
                    <Area
                        type="monotone"
                        dataKey="v"
                        stroke={color}
                        strokeWidth={1.5}
                        fill={showArea ? `url(#spark-${color.replace(/[^a-z0-9]/gi, '')})` : "none"}
                        isAnimationActive={true}
                        animationDuration={800}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
