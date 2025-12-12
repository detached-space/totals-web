import { LineChart, Line, Tooltip, XAxis, YAxis, ResponsiveContainer } from "recharts";

const data = [
    { month: "Jan", value: 12000 },
    { month: "Feb", value: 14000 },
    { month: "Mar", value: 19000 },
    { month: "Apr", value: 22000 },
];

export default function NetWorthChart() {
    return (
        <div className="rounded-[var(--radius-ui)] border p-4 bg-[var(--color-bg)] shadow-[var(--shadow-soft)] text-[var(--color-text)]">
            <h3 className="text-lg font-medium mb-4">Net Worth Trend</h3>
            <ResponsiveContainer width="100%" height={250}>
                <LineChart data={data}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="currentColor" strokeWidth={3} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}