import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface DonutChartProps {
    data: { name: string; value: number; color: string }[];
    centerLabel?: string;
    centerValue?: string;
    size?: 'sm' | 'md' | 'lg';
}

const sizeConfig = {
    sm: { inner: 40, outer: 55, height: 150 },
    md: { inner: 55, outer: 75, height: 200 },
    lg: { inner: 65, outer: 85, height: 250 },
};

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload?.length) {
        return (
            <div className="glass-panel-sm p-2 shadow-lg">
                <p className="text-xs font-medium text-[var(--foreground)]">{payload[0].name}</p>
                <p className="text-sm font-bold" style={{ color: payload[0].payload.color }}>
                    ${payload[0].value.toLocaleString()}
                </p>
            </div>
        );
    }
    return null;
};

export default function DonutChart({ data, centerLabel, centerValue, size = 'md' }: DonutChartProps) {
    const config = sizeConfig[size];

    return (
        <div className="relative" style={{ height: config.height }}>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        innerRadius={config.inner}
                        outerRadius={config.outer}
                        paddingAngle={4}
                        dataKey="value"
                        stroke="none"
                        cornerRadius={3}
                        isAnimationActive={true}
                        animationDuration={1000}
                    >
                        {data.map((entry, index) => (
                            <Cell key={index} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                </PieChart>
            </ResponsiveContainer>

            {(centerLabel || centerValue) && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                    {centerLabel && <span className="text-overline block">{centerLabel}</span>}
                    {centerValue && <span className="text-xl font-bold text-[var(--foreground)]">{centerValue}</span>}
                </div>
            )}
        </div>
    );
}
