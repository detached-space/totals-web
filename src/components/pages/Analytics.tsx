import { motion } from "framer-motion";
import GlassCard from "../shared/GlassCard";
import StatCard from "../cards/StatCard";
import HealthScore from "../charts/HealthScore";
import IncomeExpenseChart from "../charts/IncomeExpenseChart";
import CashFlowChart from "../charts/CashFlowChart";
import DonutChart from "../charts/DonutChart";
import { accounts, spendingCategories, incomeTotal, expenseTotal, totalSpending } from "../../lib/data";
import { formatCompact } from "../../lib/helpers";
import { PiggyBank, TrendingUp, Wallet, BarChart3 } from "lucide-react";
import { bentoItemVariants } from "../layout/BentoGrid";
import { BarChart, Bar, XAxis, ResponsiveContainer, Cell, Tooltip } from "recharts";

const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.06 } },
};

const savingsRate = Math.round(((incomeTotal - expenseTotal) / incomeTotal) * 100);

const barColors = ['#a78bfa', '#60a5fa', '#fbbf24', '#f87171', '#34d399'];

export default function Analytics() {
    const balanceData = accounts.map(a => ({
        name: a.name.split(' ')[0],
        balance: a.balance,
    }));

    return (
        <div className="px-8 pb-8 max-w-[1600px] mx-auto">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-col gap-5"
            >
                {/* Row 1: Health Score + Income/Expense Chart + Savings Rate */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    <motion.div variants={bentoItemVariants}>
                        <GlassCard padding="lg" hoverLift={false} className="h-full flex flex-col items-center justify-center">
                            <HealthScore score={78} />
                        </GlassCard>
                    </motion.div>

                    <motion.div variants={bentoItemVariants} className="sm:col-span-2">
                        <GlassCard padding="lg" hoverLift={false}>
                            <h3 className="text-sm font-semibold text-[var(--foreground)] mb-3">Income vs Expenses</h3>
                            <IncomeExpenseChart height={230} />
                        </GlassCard>
                    </motion.div>

                    <StatCard title="Savings Rate" value={savingsRate} prefix="" suffix="%" decimals={0} icon={PiggyBank} color="#22c55e" trend={4.2} />
                </div>

                {/* Row 2: Spending Donut + Account Balances */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    <motion.div variants={bentoItemVariants}>
                        <GlassCard padding="lg" hoverLift={false}>
                            <h3 className="text-sm font-semibold text-[var(--foreground)] mb-3">Spending by Category</h3>
                            <div className="flex flex-col sm:flex-row items-center gap-6">
                                <DonutChart
                                    data={spendingCategories}
                                    centerLabel="Total"
                                    centerValue={`$${formatCompact(totalSpending)}`}
                                    size="lg"
                                />
                                <div className="flex-1 space-y-3">
                                    {spendingCategories.map((cat) => (
                                        <div key={cat.name} className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full" style={{ background: cat.color }} />
                                                <span className="text-sm text-[var(--foreground)]">{cat.name}</span>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-sm font-semibold text-[var(--foreground)]">${cat.value}</span>
                                                <span className="text-xs text-[var(--muted)] ml-2">
                                                    {Math.round((cat.value / totalSpending) * 100)}%
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </GlassCard>
                    </motion.div>

                    <motion.div variants={bentoItemVariants}>
                        <GlassCard padding="lg" hoverLift={false}>
                            <h3 className="text-sm font-semibold text-[var(--foreground)] mb-3">Account Balances</h3>
                            <div className="h-[250px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={balanceData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                        <XAxis
                                            dataKey="name"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: 'var(--muted)', fontSize: 11 }}
                                        />
                                        <Tooltip
                                            content={({ active, payload }: any) => {
                                                if (active && payload?.length) {
                                                    return (
                                                        <div className="glass-panel-sm p-2 shadow-lg">
                                                            <p className="text-sm font-bold text-[var(--foreground)]">
                                                                ${payload[0].value.toLocaleString()}
                                                            </p>
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            }}
                                            cursor={{ fill: 'var(--card-border)', opacity: 0.3 }}
                                        />
                                        <Bar dataKey="balance" radius={[6, 6, 0, 0]} isAnimationActive animationDuration={800}>
                                            {balanceData.map((_, i) => (
                                                <Cell key={i} fill={barColors[i % barColors.length]} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </GlassCard>
                    </motion.div>
                </div>

                {/* Row 3: Cash Flow + Stats */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    <motion.div variants={bentoItemVariants}>
                        <GlassCard padding="lg" hoverLift={false}>
                            <h3 className="text-sm font-semibold text-[var(--foreground)] mb-3">Cash Flow</h3>
                            <CashFlowChart height={230} />
                        </GlassCard>
                    </motion.div>

                    <div className="grid grid-cols-2 gap-5">
                        <StatCard title="Total Income" value={incomeTotal} icon={TrendingUp} color="#22c55e" />
                        <StatCard title="Total Expenses" value={expenseTotal} icon={Wallet} color="#f87171" />
                        <StatCard title="Net Cash Flow" value={incomeTotal - expenseTotal} icon={BarChart3} color="#60a5fa" />
                        <StatCard title="Accounts" value={accounts.length} prefix="" decimals={0} icon={Wallet} color="#a78bfa" />
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
