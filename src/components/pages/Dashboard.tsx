import { useEffect, useState } from "react";
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
import { ArrowRight, TrendingUp, ArrowDownLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { api, categoryColorMap, type ApiTransaction, type ApiCategory } from "../../lib/api";
import type { Transaction, Account, SpendingCategory, NetWorthDataPoint } from "../../lib/types";

const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.06 } },
};

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

function computeNetWorthHistory(
    txns: ApiTransaction[],
    currentTotal: number
): NetWorthDataPoint[] {
    const monthMap: Record<string, { credits: number; debits: number; order: number }> = {};

    for (const t of txns) {
        if (!t.time) continue;
        const d = new Date(t.time);
        const key = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
        const order = d.getFullYear() * 12 + d.getMonth();
        if (!monthMap[key]) monthMap[key] = { credits: 0, debits: 0, order };
        if (t.type === 'CREDIT') monthMap[key].credits += t.amount;
        else monthMap[key].debits += t.amount;
    }

    const sorted = Object.entries(monthMap)
        .sort((a, b) => a[1].order - b[1].order);

    const result: NetWorthDataPoint[] = [];
    let runningBalance = currentTotal;

    for (let i = sorted.length - 1; i >= 0; i--) {
        const [month, { credits, debits }] = sorted[i];
        result.unshift({ month, value: Math.round(runningBalance) });
        runningBalance = runningBalance - credits + debits;
    }

    return result.slice(-7);
}

function computeSpendingBreakdown(
    txns: ApiTransaction[],
    categories: ApiCategory[]
): SpendingCategory[] {
    const catMap = new Map(categories.map(c => [c.id, c]));
    const spending: Record<number, number> = {};

    for (const t of txns) {
        if (t.type !== 'DEBIT' || !t.categoryId) continue;
        spending[t.categoryId] = (spending[t.categoryId] ?? 0) + t.amount;
    }

    return Object.entries(spending)
        .map(([idStr, value]) => {
            const cat = catMap.get(Number(idStr));
            return {
                name: cat?.name ?? 'Other',
                value: Math.round(value),
                color: categoryColorMap[cat?.colorKey ?? ''] ?? '#a78bfa',
            };
        })
        .sort((a, b) => b.value - a.value)
        .slice(0, 6);
}

function computeInsight(
    txns: ApiTransaction[],
    categories: ApiCategory[]
): { message: string; type: 'success' | 'warning' | 'info' } {
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    const catMap = new Map(categories.map(c => [c.id, c]));
    const thisMonth: Record<number, number> = {};
    const lastMonth: Record<number, number> = {};

    for (const t of txns) {
        if (t.type !== 'DEBIT' || !t.categoryId || !t.time) continue;
        const d = new Date(t.time);
        if (d >= thisMonthStart) {
            thisMonth[t.categoryId] = (thisMonth[t.categoryId] ?? 0) + t.amount;
        } else if (d >= lastMonthStart && d <= lastMonthEnd) {
            lastMonth[t.categoryId] = (lastMonth[t.categoryId] ?? 0) + t.amount;
        }
    }

    let bestCatId: number | null = null;
    let bestPct = 0;
    let bestSign = 0;

    for (const [idStr, thisAmt] of Object.entries(thisMonth)) {
        const id = Number(idStr);
        const lastAmt = lastMonth[id];
        if (!lastAmt || lastAmt === 0) continue;
        const pct = ((lastAmt - thisAmt) / lastAmt) * 100;
        if (Math.abs(pct) > Math.abs(bestPct)) {
            bestPct = pct;
            bestCatId = id;
            bestSign = pct > 0 ? 1 : -1;
        }
    }

    if (bestCatId === null || Math.abs(bestPct) < 5) {
        const totalThis = Object.values(thisMonth).reduce((s, v) => s + v, 0);
        const totalLast = Object.values(lastMonth).reduce((s, v) => s + v, 0);
        if (totalLast > 0 && totalThis < totalLast) {
            const pct = Math.round(((totalLast - totalThis) / totalLast) * 100);
            return { message: `You're spending ${pct}% less overall this month. Great discipline!`, type: 'success' };
        }
        return { message: "Your spending looks consistent with last month. Keep tracking!", type: 'info' };
    }

    const catName = catMap.get(bestCatId)?.name ?? 'this category';
    const pctRounded = Math.round(Math.abs(bestPct));

    if (bestSign === 1) {
        return {
            message: `You've spent ${pctRounded}% less on ${catName} this month compared to last. Keep it up!`,
            type: 'success',
        };
    }
    return {
        message: `You've spent ${pctRounded}% more on ${catName} this month than last month. Watch your budget!`,
        type: 'warning',
    };
}

function computeStatTrend(txns: ApiTransaction[], type: 'CREDIT' | 'DEBIT'): number {
    const now = new Date();
    const thisStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    let thisTotal = 0;
    let lastTotal = 0;

    for (const t of txns) {
        if (t.type !== type || !t.time) continue;
        const d = new Date(t.time);
        if (d >= thisStart) thisTotal += t.amount;
        else if (d >= lastStart && d <= lastEnd) lastTotal += t.amount;
    }

    if (lastTotal === 0) return 0;
    return Math.round(((thisTotal - lastTotal) / lastTotal) * 100 * 10) / 10;
}

export default function Dashboard() {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [totalBalance, setTotalBalance] = useState(0);
    const [incomeTotal, setIncomeTotal] = useState(0);
    const [expenseTotal, setExpenseTotal] = useState(0);
    const [trend, setTrend] = useState(0);
    const [incomeTrend, setIncomeTrend] = useState(0);
    const [expenseTrend, setExpenseTrend] = useState(0);
    const [netWorthData, setNetWorthData] = useState<NetWorthDataPoint[]>([]);
    const [spendingData, setSpendingData] = useState<SpendingCategory[]>([]);
    const [insight, setInsight] = useState<{ message: string; type: 'success' | 'warning' | 'info' }>({
        message: 'Loading your financial insights...',
        type: 'info',
    });
    const [selectedAccount, setSelectedAccount] = useState<number | null>(null);

    useEffect(() => {
        Promise.all([
            api.summary(),
            api.accounts(),
            api.transactions({ limit: '500' }),
            api.categories(),
        ]).then(([summary, apiAccounts, apiTxns, apiCategories]) => {
            // Summary
            setTotalBalance(summary.totalBalance);
            setIncomeTotal(summary.totalCredit);
            setExpenseTotal(summary.totalDebit);
            setTrend(
                summary.totalBalance > 0
                    ? Math.round(((summary.totalCredit - summary.totalDebit) / summary.totalBalance) * 100 * 10) / 10
                    : 0
            );

            // Accounts
            setAccounts(
                apiAccounts.map(a => ({
                    id: a.bank,
                    name: a.bankName,
                    balance: a.balance,
                    accountNumber: a.accountNumber,
                }))
            );

            const txns = apiTxns.data;

            // Recent transactions (last 5)
            setTransactions(txns.slice(0, 5).map(mapTransaction));

            // Net worth history
            setNetWorthData(computeNetWorthHistory(txns, summary.totalBalance));

            // Spending breakdown (DEBIT, grouped by category)
            setSpendingData(computeSpendingBreakdown(txns, apiCategories));

            // Insight
            setInsight(computeInsight(txns, apiCategories));

            // Stat card trends
            setIncomeTrend(computeStatTrend(txns, 'CREDIT'));
            setExpenseTrend(computeStatTrend(txns, 'DEBIT'));
        }).catch(console.error);
    }, []);

    return (
        <div className="px-8 pb-12 max-w-[1600px] mx-auto">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-col gap-5"
            >
                {/* Row 1: Hero Balance */}
                <BalanceCard total={totalBalance} trend={trend} income={incomeTotal} expenses={expenseTotal} />

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
                    <StatCard title="Income" value={incomeTotal} icon={ArrowDownLeft} color="var(--success)" trend={incomeTrend} />
                    <StatCard title="Expenses" value={expenseTotal} icon={TrendingUp} color="var(--danger)" trend={expenseTrend} />
                    <InsightCard
                        message={insight.message}
                        type={insight.type}
                        className="sm:col-span-2"
                    />
                </div>

                {/* Row 4: Net Worth Chart + Spending Donut */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                    <motion.div variants={bentoItemVariants} className="lg:col-span-2">
                        <GlassCard padding="lg" hoverLift={false} className="h-full cursor-crosshair">
                            <NetWorthChart data={netWorthData} height={280} />
                        </GlassCard>
                    </motion.div>
                    <SpendingBreakdown data={spendingData} total={spendingData.reduce((s, c) => s + c.value, 0)} />
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
                            {transactions.map((t, i) => (
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
