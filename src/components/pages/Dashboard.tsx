import { motion } from "framer-motion";
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
import { useState } from "react";

const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.06 } },
};

// Cards slam in from below with a rubber-band overshoot
const slamVariants = {
    hidden: { opacity: 0, y: 60, scale: 0.9 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            delay: 0.1 + i * 0.08,
            type: 'spring' as const,
            damping: 12,
            stiffness: 180,
        },
    }),
};

// Transactions slide in from the right
const txVariants = {
    hidden: { opacity: 0, x: 30 },
    visible: (i: number) => ({
        opacity: 1,
        x: 0,
        transition: {
            delay: i * 0.06,
            type: 'spring' as const,
            damping: 20,
            stiffness: 300,
        },
    }),
};

export default function Dashboard() {
    const recentTransactions = transactions.slice(0, 5);
    const [selectedAccount, setSelectedAccount] = useState<number | null>(null);

    return (
        <div className="px-8 pb-12 max-w-[1600px] mx-auto">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-col gap-5"
            >
                {/* Row 1: Hero Balance */}
                <BalanceCard total={totalBalance} trend={12.5} income={incomeTotal} expenses={expenseTotal} />

                {/* Row 2: Account Cards — Horizontal Scroll */}
                <motion.div variants={bentoItemVariants}>
                    <div className="flex items-center justify-between mb-3">
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
                                variants={slamVariants}
                                initial="hidden"
                                animate="visible"
                                className="snap-start shrink-0 w-[260px]"
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

                {/* Row 3: Stats + Insight */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard title="Income" value={incomeTotal} icon={ArrowDownLeft} color="var(--success)" trend={8.2} />
                    <StatCard title="Expenses" value={expenseTotal} icon={TrendingUp} color="var(--danger)" trend={-3.1} />

                    <InsightCard
                        message="You've spent 23% less on food this month compared to last. Keep it up!"
                        type="success"
                        className="sm:col-span-2"
                    />
                </div>

                {/* Row 4: Chart + Spending Donut */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                    <motion.div variants={bentoItemVariants} className="lg:col-span-2">
                        <GlassCard padding="lg" hoverLift={false} className="h-full cursor-crosshair">
                            <NetWorthChart height={280} />
                        </GlassCard>
                    </motion.div>

                    <SpendingBreakdown />
                </div>

                {/* Row 5: Recent Transactions */}
                <motion.div variants={bentoItemVariants}>
                    <GlassCard padding="lg" hoverLift={false}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-subsection-title text-[var(--foreground)]">Recent Transactions</h3>
                            <Link to="/transactions" className="text-link-subtle flex items-center gap-1">
                                View All <ArrowRight size={12} />
                            </Link>
                        </div>
                        <div className="divide-y divide-[var(--card-border)]">
                            {recentTransactions.map((t, i) => (
                                <motion.div
                                    key={i}
                                    custom={i}
                                    variants={txVariants}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                >
                                    <TransactionItem transaction={t} compact />
                                </motion.div>
                            ))}
                        </div>
                    </GlassCard>
                </motion.div>
            </motion.div>
        </div>
    );
}
