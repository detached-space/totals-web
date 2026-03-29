import { useState, useEffect } from "react";
import { AreaChart, Area, Tooltip, XAxis, YAxis, ResponsiveContainer, CartesianGrid } from "recharts";
import { netWorthData } from "../../lib/data";

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload?.length) {
        return (
            <div className="bg-[var(--card)] border-[var(--border-width)] border-[var(--card-border)] shadow-[var(--shadow-brutal)] rounded-lg p-3">
                <p className="text-label-light mb-1">{label}</p>
                <p className="text-subsection-title text-[var(--accent)] nums">
                    ${payload[0].value.toLocaleString()}
                </p>
            </div>
        );
    }
    return null;
};

// Custom active dot with sonar ping
const SonarDot = (props: any) => {
    const { cx, cy } = props;
    if (!cx || !cy) return null;
    return (
        <g>
            <circle cx={cx} cy={cy} r="8" fill="var(--accent)" opacity="0.15">
                <animate attributeName="r" from="6" to="20" dur="1.5s" repeatCount="indefinite" />
                <animate attributeName="opacity" from="0.3" to="0" dur="1.5s" repeatCount="indefinite" />
            </circle>
            <circle cx={cx} cy={cy} r="4" fill="var(--accent)" stroke="var(--background)" strokeWidth="2" />
        </g>
    );
};

interface NetWorthChartProps {
    data?: typeof netWorthData;
    height?: number;
    showHeader?: boolean;
}

export default function NetWorthChart({ data = netWorthData, height = 300, showHeader = true }: NetWorthChartProps) {
    // Breathing gradient opacity
    const [breathe, setBreathe] = useState(0.3);
    useEffect(() => {
        let frame: number;
        const animate = () => {
            setBreathe(0.25 + Math.sin(Date.now() / 3000) * 0.1);
            frame = requestAnimationFrame(animate);
        };
        frame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(frame);
    }, []);

    return (
        <div className="w-full h-full flex flex-col">
            {showHeader && (
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h3 className="text-subsection-title text-[var(--foreground)]">Net Worth</h3>
                        <p className="text-caption">+24% vs last month</p>
                    </div>
                </div>
            )}

            <div className="flex-1 w-full cursor-crosshair" style={{ minHeight: height }}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorNetWorth" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--accent)" stopOpacity={breathe} />
                                <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} stroke="var(--card-border)" strokeDasharray="4 4" />
                        <XAxis
                            dataKey="month"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: 'var(--muted)', fontSize: 11, fontWeight: 400 }}
                            dy={10}
                        />
                        <YAxis hide domain={['dataMin - 2000', 'dataMax + 2000']} />
                        <Tooltip
                            content={<CustomTooltip />}
                            cursor={{ stroke: 'var(--accent)', strokeWidth: 1, strokeDasharray: '4 4', opacity: 0.4 }}
                        />
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke="var(--accent)"
                            strokeWidth={2.5}
                            fillOpacity={1}
                            fill="url(#colorNetWorth)"
                            isAnimationActive={true}
                            animationDuration={2000}
                            animationEasing="ease-out"
                            activeDot={<SonarDot />}
                            dot={false}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
