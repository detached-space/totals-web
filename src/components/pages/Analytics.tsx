import { useRef } from "react";
import { motion, useScroll } from "framer-motion";
import GlassCard from "../shared/GlassCard";
import StatCard from "../cards/StatCard";
import HealthScore from "../charts/HealthScore";
import IncomeExpenseChart from "../charts/IncomeExpenseChart";
import CashFlowChart from "../charts/CashFlowChart";
import DonutChart from "../charts/DonutChart";
import { accounts, transactions, spendingCategories, incomeTotal, expenseTotal, totalSpending } from "../../lib/data";
import { formatCompact } from "../../lib/helpers";
import { PiggyBank, TrendingUp, Wallet, BarChart3 } from "lucide-react";
import { bentoItemVariants } from "../layout/BentoGrid";

const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.06 } },
};

const savingsRate = Math.round(((incomeTotal - expenseTotal) / incomeTotal) * 100);

// Top expenses sorted by amount
const topExpenses = transactions
    .filter(t => t.type === 'DEBIT')
    .sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount))
    .slice(0, 6);

const popColors = ['var(--accent)', 'var(--pop-blue)', 'var(--pop-purple)', 'var(--pop-orange)', 'var(--pop-pink)', 'var(--pop-yellow)'];

const barItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
        opacity: 1,
        x: 0,
        transition: {
            delay: i * 0.08,
            type: 'spring' as const,
            damping: 20,
            stiffness: 300,
        },
    }),
};

export default function Analytics() {
    const scrollRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: scrollRef, offset: ["start start", "end start"] });
    void scrollYProgress;

    const maxExpense = Math.max(...topExpenses.map(t => Math.abs(t.amount)));

    return (
        <div ref={scrollRef} className="px-8 pb-8 max-w-[1600px] mx-auto">
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
                            <h3 className="text-body-title text-[var(--foreground)] mb-3">Income vs Expenses</h3>
                            <div className="cursor-crosshair"><IncomeExpenseChart height={230} /></div>
                        </GlassCard>
                    </motion.div>

                    <StatCard title="Savings Rate" value={savingsRate} prefix="" suffix="%" decimals={0} icon={PiggyBank} color="var(--success)" trend={4.2} />
                </div>

                {/* Row 2: Spending Donut + Top Expenses */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    <motion.div variants={bentoItemVariants}>
                        <GlassCard padding="lg" hoverLift={false}>
                            <h3 className="text-body-title text-[var(--foreground)] mb-3">Spending by Category</h3>
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
                                                <div className="w-2.5 h-2.5 rounded-sm border border-[var(--card-border)]" style={{ background: cat.color }} />
                                                <span className="text-sm font-bold text-[var(--foreground)]">{cat.name}</span>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-sm font-black text-[var(--foreground)] nums">${cat.value}</span>
                                                <span className="text-[10px] font-bold text-[var(--muted)] ml-2">
                                                    {Math.round((cat.value / totalSpending) * 100)}%
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </GlassCard>
                    </motion.div>

                    {/* Top Expenses — horizontal bar race */}
                    <motion.div variants={bentoItemVariants}>
                        <GlassCard padding="lg" hoverLift={false}>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-body-title text-[var(--foreground)]">Biggest Expenses</h3>
                                <span className="brutal-tag bg-[var(--danger)] text-white">This month</span>
                            </div>
                            <div className="space-y-3">
                                {topExpenses.map((tx, i) => {
                                    const pct = (Math.abs(tx.amount) / maxExpense) * 100;
                                    return (
                                        <motion.div
                                            key={i}
                                            custom={i}
                                            variants={barItemVariants}
                                            initial="hidden"
                                            whileInView="visible"
                                            viewport={{ once: true }}
                                            className="flex items-center gap-3"
                                        >
                                            <span className="text-[10px] font-black text-[var(--muted)] w-4 shrink-0">
                                                {i + 1}
                                            </span>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="text-xs font-bold text-[var(--foreground)] truncate">
                                                        {tx.creditor || tx.reference}
                                                    </span>
                                                    <span className="text-xs font-black text-[var(--foreground)] nums shrink-0 ml-2">
                                                        ${Math.abs(tx.amount).toLocaleString()}
                                                    </span>
                                                </div>
                                                <div className="h-2.5 rounded-sm bg-[var(--muted-fill)] border border-[var(--card-border)] overflow-hidden">
                                                    <motion.div
                                                        className="h-full"
                                                        style={{ backgroundColor: popColors[i % popColors.length] }}
                                                        initial={{ width: 0 }}
                                                        whileInView={{ width: `${pct}%` }}
                                                        viewport={{ once: true }}
                                                        transition={{ delay: 0.2 + i * 0.08, duration: 0.5, ease: "easeOut" }}
                                                    />
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </GlassCard>
                    </motion.div>
                </div>

                {/* Row 3: Cash Flow + Stats */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    <motion.div variants={bentoItemVariants}>
                        <GlassCard padding="lg" hoverLift={false}>
                            <h3 className="text-body-title text-[var(--foreground)] mb-3">Cash Flow</h3>
                            <div className="cursor-crosshair"><CashFlowChart height={230} /></div>
                        </GlassCard>
                    </motion.div>

                    <div className="grid grid-cols-2 gap-4">
                        <StatCard title="Total Income" value={incomeTotal} icon={TrendingUp} color="var(--success)" />
                        <StatCard title="Total Expenses" value={expenseTotal} icon={Wallet} color="var(--danger)" />
                        <StatCard title="Net Cash Flow" value={incomeTotal - expenseTotal} icon={BarChart3} color="var(--pop-blue)" />
                        <StatCard title="Accounts" value={accounts.length} prefix="" decimals={0} icon={Wallet} color="var(--pop-purple)" />
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
