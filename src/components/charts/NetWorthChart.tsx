import { AreaChart, Area, Tooltip, XAxis, YAxis, ResponsiveContainer, CartesianGrid } from "recharts";

const data = [
    { month: "Jan", value: 12000 },
    { month: "Feb", value: 14500 },
    { month: "Mar", value: 13800 },
    { month: "Apr", value: 16200 },
    { month: "May", value: 21000 },
    { month: "Jun", value: 19500 },
    { month: "Jul", value: 24500 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-black/60 backdrop-blur-md border border-white/10 p-3 rounded-lg shadow-xl text-white">
                <p className="text-sm opacity-70 mb-1">{label}</p>
                <p className="text-xl font-bold text-blue-400">
                    ${payload[0].value.toLocaleString()}
                </p>
            </div>
        );
    }
    return null;
};

export default function NetWorthChart() {
    return (
        <div className="glass-panel p-6 h-full flex flex-col relative overflow-hidden group">
            <div className="flex justify-between items-center mb-6 z-10">
                <div>
                    <h3 className="text-xl font-semibold text-white/90">Net Worth</h3>
                    <p className="text-sm text-white/50">+24% vs last month</p>
                </div>
                <button className="glass-button px-3 py-1 text-xs rounded-full text-white/80">
                    Yearly
                </button>
            </div>

            <div className="flex-1 w-full min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#2d68ff" stopOpacity={0.4} />
                                <stop offset="95%" stopColor="#2d68ff" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.05)" strokeDasharray="5 5" />
                        <XAxis
                            dataKey="month"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            hide
                            domain={['dataMin - 1000', 'dataMax + 1000']}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2 }} />
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke="#2d68ff"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorValue)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Decorative background blur */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-blue-500/10 blur-[100px] -z-0 pointer-events-none" />
        </div>
    );
}