import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { monthlyComparison } from "../../lib/data";

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload?.length) {
        return (
            <div className="bg-[var(--card)] border-[var(--border-width)] border-[var(--card-border)] shadow-[var(--shadow-brutal)] rounded-lg p-3">
                <p className="text-label-light mb-2">{label}</p>
                {payload.map((p: any) => (
                    <p key={p.name} className="text-caption nums" style={{ color: p.color }}>
                        {p.name}: ${p.value.toLocaleString()}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

interface IncomeExpenseChartProps {
    data?: typeof monthlyComparison;
    height?: number;
}

export default function IncomeExpenseChart({ data = monthlyComparison, height = 250 }: IncomeExpenseChartProps) {
    return (
        <div style={{ height }} className="w-full cursor-crosshair">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} barGap={4} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid vertical={false} stroke="var(--card-border)" strokeDasharray="4 4" />
                    <XAxis
                        dataKey="month"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'var(--muted)', fontSize: 12 }}
                    />
                    <YAxis hide />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--card-border)', opacity: 0.3 }} />
                    <Bar dataKey="income" fill="#10B981" radius={[4, 4, 0, 0]} name="Income" isAnimationActive animationDuration={1200} animationEasing="ease-out" />
                    <Bar dataKey="expenses" fill="#EF4444" radius={[4, 4, 0, 0]} name="Expenses" isAnimationActive animationDuration={1200} animationEasing="ease-out" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
