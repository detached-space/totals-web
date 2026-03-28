import { AreaChart, Area, Tooltip, XAxis, YAxis, ResponsiveContainer, CartesianGrid } from "recharts";
import { netWorthData } from "../../lib/data";

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload?.length) {
        return (
            <div className="glass-panel-sm p-3 shadow-xl">
                <p className="text-xs text-[var(--muted)] mb-1">{label}</p>
                <p className="text-lg font-bold text-[var(--accent)]">
                    ${payload[0].value.toLocaleString()}
                </p>
            </div>
        );
    }
    return null;
};

interface NetWorthChartProps {
    data?: typeof netWorthData;
    height?: number;
    showHeader?: boolean;
}

export default function NetWorthChart({ data = netWorthData, height = 300, showHeader = true }: NetWorthChartProps) {
    return (
        <div className="w-full h-full flex flex-col">
            {showHeader && (
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h3 className="text-lg font-semibold text-[var(--foreground)]">Net Worth</h3>
                        <p className="text-xs text-[var(--muted)]">+24% vs last month</p>
                    </div>
                </div>
            )}

            <div className="flex-1 w-full" style={{ minHeight: height }}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorNetWorth" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} stroke="var(--card-border)" strokeDasharray="4 4" />
                        <XAxis
                            dataKey="month"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: 'var(--muted)', fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis hide domain={['dataMin - 2000', 'dataMax + 2000']} />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--card-border)', strokeWidth: 1 }} />
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke="var(--accent)"
                            strokeWidth={2.5}
                            fillOpacity={1}
                            fill="url(#colorNetWorth)"
                            isAnimationActive={true}
                            animationDuration={1200}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
