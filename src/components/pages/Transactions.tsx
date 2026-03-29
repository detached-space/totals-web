import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import GlassCard from "../shared/GlassCard";
import TransactionItem from "../widgets/TransactionItem";
import SearchFilter from "../widgets/SearchFilter";
import StatCard from "../cards/StatCard";
import DonutChart from "../charts/DonutChart";
import IncomeExpenseChart from "../charts/IncomeExpenseChart";
import { getDateGroup } from "../../lib/helpers";
import { ArrowDownLeft, TrendingUp, Hash, DollarSign } from "lucide-react";
import { bentoItemVariants } from "../layout/BentoGrid";
import { api, type ApiTransaction } from "../../lib/api";
import type { Transaction } from "../../lib/types";

const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.06 } },
};

const chartColors = ['#a78bfa', '#60a5fa', '#fbbf24', '#f87171', '#34d399', '#fb923c'];

function mapTransaction(t: ApiTransaction): Transaction {
    return {
        amount: t.type === 'DEBIT' ? -Math.abs(t.amount) : Math.abs(t.amount),
        reference: t.reference,
        creditor: t.creditor ?? undefined,
        time: t.time ?? undefined,
        status: t.status ?? undefined,
        currentBalance: t.currentBalance ?? undefined,
        bankId: t.bankId ?? undefined,
        type: t.type,
        transactionLink: t.transactionLink ?? undefined,
        accountNumber: t.accountNumber ?? undefined,
    };
}

function computeMonthlyComparison(txns: ApiTransaction[]) {
    const monthMap: Record<string, { income: number; expenses: number; order: number }> = {};

    for (const t of txns) {
        if (!t.time) continue;
        const d = new Date(t.time);
        const key = d.toLocaleDateString('en-US', { month: 'short' });
        const order = d.getFullYear() * 12 + d.getMonth();
        if (!monthMap[key]) monthMap[key] = { income: 0, expenses: 0, order };
        if (t.type === 'CREDIT') monthMap[key].income += t.amount;
        else monthMap[key].expenses += t.amount;
    }

    return Object.entries(monthMap)
        .sort((a, b) => a[1].order - b[1].order)
        .slice(-7)
        .map(([month, { income, expenses }]) => ({
            month,
            income: Math.round(income),
            expenses: Math.round(expenses),
        }));
}

function computeStatTrend(txns: ApiTransaction[], type: 'CREDIT' | 'DEBIT'): number {
    const now = new Date();
    const thisStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastEnd = new Date(now.getFullYear(), now.getMonth(), 0);
    let thisTotal = 0, lastTotal = 0;
    for (const t of txns) {
        if (t.type !== type || !t.time) continue;
        const d = new Date(t.time);
        if (d >= thisStart) thisTotal += t.amount;
        else if (d >= lastStart && d <= lastEnd) lastTotal += t.amount;
    }
    if (lastTotal === 0) return 0;
    return Math.round(((thisTotal - lastTotal) / lastTotal) * 100 * 10) / 10;
}

export default function Transactions() {
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState<string | null>(null);

    const [allTxns, setAllTxns] = useState<ApiTransaction[]>([]);
    const [incomeTotal, setIncomeTotal] = useState(0);
    const [expenseTotal, setExpenseTotal] = useState(0);
    const [incomeTrend, setIncomeTrend] = useState(0);
    const [expenseTrend, setExpenseTrend] = useState(0);
    const [monthlyData, setMonthlyData] = useState<{ month: string; income: number; expenses: number }[]>([]);
    const [byAccount, setByAccount] = useState<{ name: string; value: number; color: string }[]>([]);

    useEffect(() => {
        Promise.all([
            api.summary(),
            api.transactions({ limit: '500' }),
            api.transactionStats(),
        ]).then(([summary, txns, stats]) => {
            setIncomeTotal(summary.totalCredit);
            setExpenseTotal(summary.totalDebit);
            setAllTxns(txns.data);
            setMonthlyData(computeMonthlyComparison(txns.data));
            setIncomeTrend(computeStatTrend(txns.data, 'CREDIT'));
            setExpenseTrend(computeStatTrend(txns.data, 'DEBIT'));
            setByAccount(
                stats.byAccount.map((b, i) => ({
                    name: b.name,
                    value: b.count,
                    color: chartColors[i % chartColors.length],
                }))
            );
        }).catch(console.error);
    }, []);

    const transactions = useMemo(() => allTxns.map(mapTransaction), [allTxns]);

    const filtered = useMemo(() => {
        return transactions.filter(t => {
            const matchSearch = !search ||
                t.reference.toLowerCase().includes(search.toLowerCase()) ||
                t.creditor?.toLowerCase().includes(search.toLowerCase());
            const matchType = !typeFilter || t.type === typeFilter;
            const matchStatus = !statusFilter || t.status === statusFilter;
            return matchSearch && matchType && matchStatus;
        });
    }, [transactions, search, typeFilter, statusFilter]);

    const grouped = useMemo(() => {
        const groups: Record<string, Transaction[]> = {};
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
                    <StatCard title="Total Income" value={incomeTotal} icon={ArrowDownLeft} color="#10B981" trend={incomeTrend} />
                    <StatCard title="Total Expenses" value={expenseTotal} icon={TrendingUp} color="#EF4444" trend={expenseTrend} />
                    <StatCard title="Transactions" value={filtered.length} icon={Hash} prefix="" suffix="" decimals={0} color="#a78bfa" />
                    <StatCard title="Avg Transaction" value={avgTransaction} icon={DollarSign} color="#f59e0b" />
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    <motion.div variants={bentoItemVariants}>
                        <GlassCard padding="lg" hoverLift={false}>
                            <h3 className="text-body-title text-[var(--foreground)] mb-3">Income vs Expenses</h3>
                            <div className="cursor-crosshair">
                                <IncomeExpenseChart data={monthlyData} height={220} />
                            </div>
                        </GlassCard>
                    </motion.div>

                    <motion.div variants={bentoItemVariants}>
                        <GlassCard padding="lg" hoverLift={false}>
                            <h3 className="text-body-title text-[var(--foreground)] mb-3">By Account</h3>
                            <div className="cursor-crosshair">
                                <DonutChart
                                    data={byAccount}
                                    centerLabel="Total"
                                    centerValue={`${filtered.length}`}
                                    size="md"
                                />
                            </div>
                        </GlassCard>
                    </motion.div>
                </div>

                {/* Transaction Timeline */}
                <motion.div variants={bentoItemVariants}>
                    <GlassCard padding="lg" hoverLift={false}>
                        <h3 className="text-subsection-title text-[var(--foreground)] mb-4">Transaction History</h3>
                        <div className="space-y-6">
                            {Object.entries(grouped).map(([date, txns]) => (
                                <div key={date}>
                                    <p className="text-overline mb-2">{date}</p>
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
