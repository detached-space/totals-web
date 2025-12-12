import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const data = [
    { name: "Food", value: 400, color: "#f87171" }, // Red
    { name: "Rent", value: 1200, color: "#60a5fa" }, // Blue
    { name: "Travel", value: 300, color: "#fbbf24" }, // Amber
    { name: "Subs", value: 200, color: "#a3a3a3" }, // Gray
];

export default function SpendingStats() {
    return (
        <div className="glass-panel p-6 h-full flex flex-col min-h-[350px]">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white/90">Spending</h3>
                <select className="bg-white/5 border border-white/10 rounded-lg text-xs px-2 py-1 text-white/60 focus:outline-none">
                    <option>This Month</option>
                    <option>This Year</option>
                </select>
            </div>

            <div className="flex-1 w-full relative">
                <ResponsiveContainer width="100%" height="100%" minHeight={200}>
                    <PieChart>
                        <Pie
                            data={data}
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                            cornerRadius={4}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} className="stroke-transparent outline-none" />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{ background: 'rgba(0,0,0,0.8)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', padding: '8px' }}
                            itemStyle={{ color: '#fff', fontSize: '12px' }}
                            formatter={(value: number) => `$${value}`}
                        />
                    </PieChart>
                </ResponsiveContainer>

                {/* Center Text */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                    <span className="text-[10px] text-white/40 block uppercase tracking-wider">Total</span>
                    <span className="text-2xl font-bold text-white tracking-tight">$2.1k</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
                {data.map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-xs group">
                        <div className="flex items-center gap-2 text-white/60 group-hover:text-white transition-colors">
                            <div className="w-1.5 h-1.5 rounded-full" style={{ background: item.color }} />
                            <span>{item.name}</span>
                        </div>
                        <span className="font-medium text-white/80">${item.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
