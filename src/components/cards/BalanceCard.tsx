import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import AnimatedCounter from "../shared/AnimatedCounter";
import { bentoItemVariants } from "../layout/BentoGrid";
import { AreaChart, Area, ResponsiveContainer } from "recharts";

interface BalanceCardProps {
    total: number;
    trend?: number;
    sparklineData?: number[];
}

export default function BalanceCard({ total, trend = 12.5, sparklineData }: BalanceCardProps) {
    const isPositive = trend >= 0;
    const miniData = (sparklineData || [52, 58, 55, 62, 71, 68, 95]).map((v, i) => ({ i, v }));

    return (
        <motion.div
            variants={bentoItemVariants}
            className="glass-panel-lg p-8 relative overflow-hidden col-span-1 sm:col-span-2"
        >
            {/* Background glow */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-[var(--accent)]/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-500/8 rounded-full blur-[80px] pointer-events-none" />

            <div className="relative z-10">
                <span className="text-overline">Total Balance</span>

                <div className="flex items-end gap-4 mt-2 mb-4">
                    <AnimatedCounter
                        value={total}
                        prefix="$"
                        decimals={2}
                        className="text-display text-[var(--foreground)]"
                    />

                    <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold mb-2 ${
                        isPositive ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'
                    }`}>
                        {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                        {isPositive ? '+' : ''}{trend}%
                    </div>
                </div>

                {/* Mini sparkline */}
                <div className="h-16 w-full max-w-sm opacity-60">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={miniData}>
                            <defs>
                                <linearGradient id="balanceSparkGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.3} />
                                    <stop offset="100%" stopColor="var(--accent)" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <Area
                                type="monotone"
                                dataKey="v"
                                stroke="var(--accent)"
                                strokeWidth={2}
                                fill="url(#balanceSparkGrad)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </motion.div>
    );
}
