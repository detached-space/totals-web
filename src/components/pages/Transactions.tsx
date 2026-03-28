import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import GlassCard from "../shared/GlassCard";
import TransactionItem from "../widgets/TransactionItem";
import SearchFilter from "../widgets/SearchFilter";
import StatCard from "../cards/StatCard";
import DonutChart from "../charts/DonutChart";
import IncomeExpenseChart from "../charts/IncomeExpenseChart";
import { transactions, transactionsByAccount, incomeTotal, expenseTotal } from "../../lib/data";
import { getDateGroup } from "../../lib/helpers";
import { ArrowDownLeft, TrendingUp, Hash, DollarSign } from "lucide-react";
import { bentoItemVariants } from "../layout/BentoGrid";

const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.06 } },
};

export default function Transactions() {
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState<string | null>(null);

    const filtered = useMemo(() => {
        return transactions.filter(t => {
            const matchSearch = !search ||
                t.reference.toLowerCase().includes(search.toLowerCase()) ||
                t.creditor?.toLowerCase().includes(search.toLowerCase());
            const matchType = !typeFilter || t.type === typeFilter;
            const matchStatus = !statusFilter || t.status === statusFilter;
            return matchSearch && matchType && matchStatus;
        });
    }, [search, typeFilter, statusFilter]);

    // Group by date
    const grouped = useMemo(() => {
        const groups: Record<string, typeof transactions> = {};
        filtered.forEach(t => {
            const key = t.time ? getDateGroup(t.time) : 'Unknown';
            if (!groups[key]) groups[key] = [];
            groups[key].push(t);
        });
        return groups;
    }, [filtered]);

    const avgTransaction = filtered.length > 0
        ? Math.abs(filtered.reduce((s, t) => s + t.amount, 0) / filtered.length)
        : 0;

    const filters = [
        { label: 'Credit', value: 'CREDIT', active: typeFilter === 'CREDIT', onClick: () => setTypeFilter(typeFilter === 'CREDIT' ? null : 'CREDIT') },
        { label: 'Debit', value: 'DEBIT', active: typeFilter === 'DEBIT', onClick: () => setTypeFilter(typeFilter === 'DEBIT' ? null : 'DEBIT') },
        { label: 'Pending', value: 'PENDING', active: statusFilter === 'PENDING', onClick: () => setStatusFilter(statusFilter === 'PENDING' ? null : 'PENDING') },
        { label: 'Cleared', value: 'CLEARED', active: statusFilter === 'CLEARED', onClick: () => setStatusFilter(statusFilter === 'CLEARED' ? null : 'CLEARED') },
    ];

    return (
        <div className="px-8 pb-8 max-w-[1600px] mx-auto">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-col gap-5"
            >
                {/* Search + Filters */}
                <motion.div variants={bentoItemVariants}>
                    <SearchFilter
                        placeholder="Search transactions..."
                        value={search}
                        onChange={setSearch}
                        filters={filters}
                    />
                </motion.div>

                {/* Analytics Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    <StatCard title="Total Income" value={incomeTotal} icon={ArrowDownLeft} color="#22c55e" trend={8.2} />
                    <StatCard title="Total Expenses" value={expenseTotal} icon={TrendingUp} color="#f87171" trend={-3.1} />
                    <StatCard title="Transactions" value={filtered.length} icon={Hash} prefix="" suffix="" decimals={0} color="#a78bfa" />
                    <StatCard title="Avg Transaction" value={avgTransaction} icon={DollarSign} color="#f59e0b" />
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    <motion.div variants={bentoItemVariants}>
                        <GlassCard padding="lg" hoverLift={false}>
                            <h3 className="text-sm font-semibold text-[var(--foreground)] mb-3">Income vs Expenses</h3>
                            <IncomeExpenseChart height={220} />
                        </GlassCard>
                    </motion.div>

                    <motion.div variants={bentoItemVariants}>
                        <GlassCard padding="lg" hoverLift={false}>
                            <h3 className="text-sm font-semibold text-[var(--foreground)] mb-3">By Account</h3>
                            <DonutChart
                                data={transactionsByAccount}
                                centerLabel="Total"
                                centerValue={`${filtered.length}`}
                                size="md"
                            />
                        </GlassCard>
                    </motion.div>
                </div>

                {/* Transaction Timeline */}
                <motion.div variants={bentoItemVariants}>
                    <GlassCard padding="lg" hoverLift={false}>
                        <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">Transaction History</h3>
                        <div className="space-y-6">
                            {Object.entries(grouped).map(([date, txns]) => (
                                <div key={date}>
                                    <p className="text-xs font-semibold text-[var(--muted)] mb-2 uppercase tracking-wider">{date}</p>
                                    <div className="space-y-0.5">
                                        {txns.map((t, i) => (
                                            <TransactionItem key={i} transaction={t} />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {filtered.length === 0 && (
                            <p className="text-center text-sm text-[var(--muted)] py-12">No transactions match your filters</p>
                        )}
                    </GlassCard>
                </motion.div>
            </motion.div>
        </div>
    );
}
