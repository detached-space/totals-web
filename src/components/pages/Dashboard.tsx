import { motion } from "framer-motion";
import { bentoItemVariants } from "../layout/BentoGrid";
import BalanceCard from "../cards/BalanceCard";
import AccountCard from "../cards/AccountCard";
import StatCard from "../cards/StatCard";
import InsightCard from "../cards/InsightCard";
import SpendingBreakdown from "../widgets/SpendingBreakdown";
import QuickActions from "../widgets/QuickActions";
import TransactionItem from "../widgets/TransactionItem";
import NetWorthChart from "../charts/NetWorthChart";
import GlassCard from "../shared/GlassCard";
import { accounts, transactions, totalBalance, incomeTotal, expenseTotal } from "../../lib/data";
import { ArrowRight, TrendingUp, ArrowDownLeft } from "lucide-react";
import { Link } from "react-router-dom";

const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.06 } },
};

export default function Dashboard() {
    const recentTransactions = transactions.slice(0, 5);

    return (
        <div className="px-8 pb-8 max-w-[1600px] mx-auto">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-col gap-5"
            >
                {/* Row 1: Balance + Account Mini Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
                    <BalanceCard total={totalBalance} trend={12.5} />

                    <motion.div variants={bentoItemVariants} className="lg:col-span-2 grid grid-cols-2 gap-3">
                        {accounts.slice(0, 4).map((acc) => (
                            <AccountCard
                                key={acc.id}
                                id={acc.id}
                                name={acc.name}
                                balance={acc.balance}
                                accountNumber={acc.accountNumber}
                                compact
                            />
                        ))}
                    </motion.div>
                </div>

                {/* Row 2: Stats + Insight */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    <StatCard title="Income" value={incomeTotal} icon={ArrowDownLeft} color="#22c55e" trend={8.2} />
                    <StatCard title="Expenses" value={expenseTotal} icon={TrendingUp} color="#f87171" trend={-3.1} />

                    <InsightCard
                        message="You've spent 23% less on food this month compared to last. Keep it up!"
                        type="success"
                        className="sm:col-span-2"
                    />
                </div>

                {/* Row 3: Chart + Spending + Quick Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
                    <motion.div variants={bentoItemVariants} className="lg:col-span-2">
                        <GlassCard padding="lg" hoverLift={false} className="h-full">
                            <NetWorthChart height={280} />
                        </GlassCard>
                    </motion.div>

                    <SpendingBreakdown compact />

                    <QuickActions />
                </div>

                {/* Row 4: Recent Transactions */}
                <motion.div variants={bentoItemVariants}>
                    <GlassCard padding="lg" hoverLift={false}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-[var(--foreground)]">Recent Transactions</h3>
                            <Link to="/transactions" className="text-xs text-[var(--accent)] hover:text-[var(--accent)]/80 flex items-center gap-1 transition-colors">
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
