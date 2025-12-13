import { ArrowUpRight, ExternalLink } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import type { Transaction } from "../../lib/types";

const transactions: Transaction[] = Array.from({ length: 20 }).map((_, i) => ({
    amount: i % 2 === 0 ? -9.99 : -12.99,
    reference: i % 2 === 0 ? "Spotify Premium" : "Apple Music",
    creditor: i % 2 === 0 ? "Spotify" : "Apple",
    time: "2023-10-24T10:23:00Z",
    status: "CLEARED",
    type: "DEBIT",
    transactionLink: "https://example.com/receipt",
    accountNumber: "8821",
    bankId: i % 3 === 0 ? 1 : i % 3 === 1 ? 2 : 3
}));

const dataAmount = [
    { name: 'Awash', value: 400 },
    { name: 'Telebirr', value: 300 },
    { name: 'CBE', value: 300 },
    { name: 'Dashen', value: 200 },
];

const dataQty = [
    { name: 'Awash', value: 12 },
    { name: 'Telebirr', value: 18 },
    { name: 'CBE', value: 8 },
    { name: 'Dashen', value: 5 },
];

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042'];

export default function Transactions() {
    return (
        <div className="min-h-screen px-8 pb-8 text-[var(--color-foreground)] max-w-[1600px] mx-auto">
            <h1 className="text-3xl font-bold mb-8">Transactions</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Pie Chart: Amount per Account */}
                <div className="glass-panel p-6 h-[350px] flex flex-col">
                    <h3 className="text-lg font-semibold mb-4">Volume by Account</h3>
                    <div className="flex-1 w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={dataAmount}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {dataAmount.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '8px', color: '#fff' }}
                                />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                        {/* Center Text */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none pb-8">
                            <span className="text-2xl font-bold">$1.2k</span>
                        </div>
                    </div>
                </div>

                {/* Pie Chart: Quantity per Account */}
                <div className="glass-panel p-6 h-[350px] flex flex-col">
                    <h3 className="text-lg font-semibold mb-4">Transactions by Account</h3>
                    <div className="flex-1 w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={dataQty}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#82ca9d"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {dataQty.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '8px', color: '#fff' }}
                                />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none pb-8">
                            <span className="text-2xl font-bold">43</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Transactions List */}
            <div className="glass-panel p-6 overflow-hidden flex flex-col">
                <h3 className="text-xl font-semibold mb-6">Recent Activity</h3>
                <div className="flex flex-col gap-4">
                    {transactions.map((t, i) => (
                        <div key={i} className="flex items-center justify-between p-4 rounded-xl hover:bg-[var(--color-foreground)]/5 transition-colors border border-transparent hover:border-[var(--color-card-border)] group">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center">
                                    <ArrowUpRight size={20} />
                                </div>
                                <div>
                                    <h4 className="font-medium text-[var(--color-foreground)]">{t.reference}</h4>
                                    <p className="text-xs text-[var(--color-foreground)] opacity-50">
                                        {t.bankId === 1 ? 'Awash' : t.bankId === 2 ? 'Telebirr' : 'CBE'} • {new Date(t.time || "").toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                <span className="font-bold text-[var(--color-foreground)]">{t.amount}</span>
                                {t.transactionLink && (
                                    <a
                                        href={t.transactionLink}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="px-3 py-1.5 rounded-lg bg-[var(--color-foreground)]/10 hover:bg-[var(--color-foreground)]/20 text-xs font-medium text-[var(--color-foreground)] transition-colors flex items-center gap-2 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 duration-200"
                                    >
                                        Open <ExternalLink size={12} />
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
