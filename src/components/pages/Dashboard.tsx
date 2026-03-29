import { motion, useScroll, useTransform } from "framer-motion";
import { bentoItemVariants } from "../layout/BentoGrid";
import BalanceCard from "../cards/BalanceCard";
import AccountCard from "../cards/AccountCard";
import StatCard from "../cards/StatCard";
import InsightCard from "../cards/InsightCard";
import SpendingBreakdown from "../widgets/SpendingBreakdown";
import TransactionItem from "../widgets/TransactionItem";
import NetWorthChart from "../charts/NetWorthChart";
import GlassCard from "../shared/GlassCard";
import { accounts, transactions, totalBalance, incomeTotal, expenseTotal } from "../../lib/data";
import { ArrowRight, TrendingUp, ArrowDownLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useRef, useState } from "react";

const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            delay: i * 0.1,
            type: 'spring' as const,
            damping: 20,
            stiffness: 200,
        },
    }),
};

export default function Dashboard() {
    const recentTransactions = transactions.slice(0, 5);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [selectedAccount, setSelectedAccount] = useState<number | null>(null);

    // Scroll-driven parallax — cards move at different rates
    const { scrollYProgress } = useScroll({ target: scrollRef, offset: ["start start", "end start"] });
    const heroY = useTransform(scrollYProgress, [0, 1], [0, -50]);
    const chartY = useTransform(scrollYProgress, [0, 1], [0, -25]);

    return (
        <div ref={scrollRef} className="px-8 pb-12 max-w-[1600px] mx-auto">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-col"
            >
                {/* ── Row 1: Hero Balance ─────────────────────────────── */}
                <motion.div style={{ y: heroY }} className="mb-6">
                    <BalanceCard total={totalBalance} trend={12.5} />
                </motion.div>

                {/* ── Row 2: Account Cards — Horizontal Scroll ────────── */}
                <motion.div variants={bentoItemVariants} className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-subsection-title text-[var(--foreground)]">Your Accounts</h3>
                        <Link to="/accounts" className="text-link-subtle flex items-center gap-1">
                            View All <ArrowRight size={12} />
                        </Link>
                    </div>
                    <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide -mx-2 px-2">
                        {accounts.map((acc, i) => (
                            <motion.div
                                key={acc.id}
                                custom={i}
                                variants={cardVariants}
                                initial="hidden"
                                animate="visible"
                                className="snap-start shrink-0 w-[280px]"
                            >
                                <AccountCard
                                    id={acc.id}
                                    name={acc.name}
                                    balance={acc.balance}
                                    accountNumber={acc.accountNumber}
                                    selected={selectedAccount === acc.id}
                                    onClick={() => setSelectedAccount(selectedAccount === acc.id ? null : acc.id)}
                                    compact
                                />
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* ── Row 3: Stats + Insight ───────────────────────────── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <StatCard title="Income" value={incomeTotal} icon={ArrowDownLeft} color="#10B981" trend={8.2} />
                    <StatCard title="Expenses" value={expenseTotal} icon={TrendingUp} color="#EF4444" trend={-3.1} />

                    <InsightCard
                        message="You've spent 23% less on food this month compared to last. Keep it up!"
                        type="success"
                        className="sm:col-span-2"
                    />
                </div>

                {/* ── Row 4: Chart + Spending Donut ────────────────────── */}
                <motion.div style={{ y: chartY }} className="mb-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                        <motion.div variants={bentoItemVariants} className="lg:col-span-2">
                            <GlassCard padding="lg" hoverLift={false} className="h-full cursor-crosshair">
                                <NetWorthChart height={300} />
                            </GlassCard>
                        </motion.div>

                        <SpendingBreakdown />
                    </div>
                </motion.div>

                {/* ── Row 5: Recent Transactions ──────────────────────── */}
                <motion.div variants={bentoItemVariants}>
                    <GlassCard padding="lg" hoverLift={false}>
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-subsection-title text-[var(--foreground)]">Recent Transactions</h3>
                            <Link to="/transactions" className="text-link-subtle flex items-center gap-1">
                                View All <ArrowRight size={12} />
                            </Link>
                        </div>
                        <div className="divide-y divide-[var(--card-border)]">
                            {recentTransactions.map((t, i) => (
                                <TransactionItem key={i} transaction={t} compact />
                            ))}
                        </div>
                    </GlassCard>
                </motion.div>
            </motion.div>
        </div>
    );
}
