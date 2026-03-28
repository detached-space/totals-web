import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from "recharts";

const data = [
    { name: "Starting", value: 68500, type: "neutral" },
    { name: "Income", value: 13000, type: "income" },
    { name: "Rent", value: -1200, type: "expense" },
    { name: "Food", value: -480, type: "expense" },
    { name: "Travel", value: -320, type: "expense" },
    { name: "Utilities", value: -315, type: "expense" },
    { name: "Subs", value: -109, type: "expense" },
    { name: "Other", value: -202, type: "expense" },
    { name: "Ending", value: 78874, type: "neutral" },
];

const colors: Record<string, string> = {
    neutral: "#60a5fa",
    income: "#22c55e",
    expense: "#f87171",
};

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload?.length) {
        const val = payload[0].value;
        return (
            <div className="glass-panel-sm p-2 shadow-lg">
                <p className="text-xs text-[var(--muted)]">{payload[0].payload.name}</p>
                <p className="text-sm font-bold text-[var(--foreground)]">
                    {val >= 0 ? '+' : ''}${Math.abs(val).toLocaleString()}
                </p>
            </div>
        );
    }
    return null;
};

interface CashFlowChartProps {
    height?: number;
}

export default function CashFlowChart({ height = 250 }: CashFlowChartProps) {
    const displayData = data.map(d => ({
        ...d,
        displayValue: Math.abs(d.value),
    }));

    return (
        <div style={{ height }} className="w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={displayData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid vertical={false} stroke="var(--card-border)" strokeDasharray="4 4" />
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'var(--muted)', fontSize: 10 }}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--card-border)', opacity: 0.3 }} />
                    <Bar dataKey="displayValue" radius={[4, 4, 0, 0]} isAnimationActive animationDuration={800}>
                        {displayData.map((entry, index) => (
                            <Cell key={index} fill={colors[entry.type]} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
