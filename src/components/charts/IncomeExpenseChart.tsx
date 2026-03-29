import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { monthlyComparison } from "../../lib/data";

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload?.length) {
        const income = payload.find((p: any) => p.dataKey === 'income')?.value || 0;
        const expenses = payload.find((p: any) => p.dataKey === 'expenses')?.value || 0;
        const netFlow = income - expenses;

        return (
            <div className="bg-[var(--card)] border-[var(--border-width)] border-[var(--card-border)] shadow-[var(--shadow-brutal)] rounded-lg p-3 space-y-1">
                <p className="text-label-light font-bold">{label}</p>
                <p className="text-caption nums" style={{ color: '#00F5D4' }}>
                    Income: ${income.toLocaleString()}
                </p>
                <p className="text-caption nums" style={{ color: '#FF6B6B' }}>
                    Expenses: ${expenses.toLocaleString()}
                </p>
                <div className="border-t border-[var(--card-border)] pt-1 mt-1">
                    <p className="text-caption font-bold nums" style={{ color: '#4F46E5' }}>
                        Net: ${netFlow.toLocaleString()}
                    </p>
                </div>
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
                <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid vertical={false} stroke="var(--card-border)" strokeDasharray="4 4" />
                    <XAxis
                        dataKey="month"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'var(--muted)', fontSize: 12 }}
                    />
                    <YAxis hide />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--card-border)', opacity: 0.3 }} />
                    <Legend wrapperStyle={{ paddingTop: '12px' }} />
                    <Area
                        type="monotone"
                        dataKey="income"
                        fill="rgba(0, 245, 212, 0.25)"
                        stroke="#00F5D4"
                        strokeWidth={3}
                        name="Income"
                        isAnimationActive
                        animationDuration={1200}
                        animationEasing="ease-out"
                    />
                    <Area
                        type="monotone"
                        dataKey="expenses"
                        fill="rgba(255, 107, 107, 0.25)"
                        stroke="#FF6B6B"
                        strokeWidth={3}
                        name="Expenses"
                        isAnimationActive
                        animationDuration={1200}
                        animationEasing="ease-out"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
