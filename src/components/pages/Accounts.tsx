import { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import AccountCard from "../cards/AccountCard";
import GlassCard from "../shared/GlassCard";
import TransactionItem from "../widgets/TransactionItem";
import NetWorthChart from "../charts/NetWorthChart";
import DonutChart from "../charts/DonutChart";
import { accounts, transactions, spendingCategories } from "../../lib/data";
import { getLogo, getBankName, formatCurrency } from "../../lib/helpers";
import { usePrivacy } from "../shared/PrivacyProvider";
import { BarChart, Bar, XAxis, ResponsiveContainer, Cell, Tooltip } from "recharts";

const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] } },
};

const barColors = ['#a78bfa', '#60a5fa', '#fbbf24', '#EF4444', '#10B981'];

export default function Accounts() {
    const { hidden } = usePrivacy();
    const scrollRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: scrollRef, offset: ["start start", "end start"] });
    const carouselY = useTransform(scrollYProgress, [0, 1], [0, -40]);
    const [selectedId, setSelectedId] = useState(accounts[0].id);
    const selected = accounts.find(a => a.id === selectedId) || accounts[0];
    const accountTransactions = transactions.filter(t => t.bankId === selectedId).slice(0, 6);

    const comparisonData = accounts.map(a => ({
        name: getBankName(a.id),
        balance: a.balance,
        id: a.id,
    }));

    return (
        <div ref={scrollRef} className="px-8 pb-8 max-w-[1600px] mx-auto">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-col gap-5"
            >
                {/* Card Carousel */}
                <motion.div variants={itemVariants}>
                    <motion.div style={{ y: carouselY }}>
                    <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar snap-x snap-mandatory">
                        {accounts.map((acc) => (
                            <div
                                key={acc.id}
                                className="min-w-[300px] max-w-[340px] snap-start shrink-0"
                            >
                                <AccountCard
                                    id={acc.id}
                                    name={acc.name}
                                    balance={acc.balance}
                                    accountNumber={acc.accountNumber}
                                    selected={acc.id === selectedId}
                                    onClick={() => setSelectedId(acc.id)}
                                />
                            </div>
                        ))}
                    </div>
                    </motion.div>
                </motion.div>

                {/* Selected Account Detail */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                    {/* Balance Trend */}
                    <motion.div variants={itemVariants} className="lg:col-span-2">
                        <GlassCard padding="lg" hoverLift={false} className="h-full">
                            <div className="flex items-center gap-3 mb-4">
                                <img src={getLogo(selected.id)} alt="" className="w-6 h-6" />
                                <h3 className="text-subsection-title text-[var(--foreground)]">{selected.name}</h3>
                            </div>
                            <NetWorthChart height={260} showHeader={false} />
                        </GlassCard>
                    </motion.div>

                    {/* Account Info */}
                    <motion.div variants={itemVariants}>
                        <GlassCard padding="lg" hoverLift={false} className="h-full flex flex-col justify-between">
                            <div>
                                <p className="text-overline mb-3">Account Details</p>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-label-light">Bank</p>
                                        <p className="text-sm font-semibold text-[var(--foreground)]">{selected.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-label-light">Account Number</p>
                                        <p className="text-sm font-mono text-[var(--foreground)]">{selected.accountNumber}</p>
                                    </div>
                                    <div>
                                        <p className="text-label-light">Balance</p>
                                        <p className="text-display-sm nums text-[var(--foreground)]">{hidden ? '••••' : formatCurrency(selected.balance)}</p>
                                    </div>
                                    <div>
                                        <p className="text-label-light">Status</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="w-2 h-2 rounded-full bg-[var(--success)]" />
                                            <span className="text-sm text-[var(--success)] font-medium">Active</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </GlassCard>
                    </motion.div>
                </div>

                {/* Transactions + Spending */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                    <motion.div variants={itemVariants} className="lg:col-span-2">
                        <GlassCard padding="lg" hoverLift={false}>
                            <h3 className="text-subsection-title text-[var(--foreground)] mb-4">Recent Transactions</h3>
                            {accountTransactions.length > 0 ? (
                                <div className="space-y-1">
                                    {accountTransactions.map((t, i) => (
                                        <TransactionItem key={i} transaction={t} />
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-[var(--muted)] py-8 text-center">No transactions for this account</p>
                            )}
                        </GlassCard>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <GlassCard padding="lg" hoverLift={false} className="h-full">
                            <p className="text-body-title text-[var(--foreground)] mb-3">Spending by Category</p>
                            <DonutChart
                                data={spendingCategories}
                                centerLabel="Total"
                                centerValue={`$${spendingCategories.reduce((s, c) => s + c.value, 0).toLocaleString()}`}
                                size="sm"
                            />
                        </GlassCard>
                    </motion.div>
                </div>

                {/* All Accounts Comparison */}
                <motion.div variants={itemVariants}>
                    <GlassCard padding="lg" hoverLift={false}>
                        <h3 className="text-subsection-title text-[var(--foreground)] mb-4">Account Balances</h3>
                        <div className="h-[200px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={comparisonData} layout="vertical" margin={{ left: 60 }}>
                                    <XAxis type="number" hide />
                                    <Tooltip
                                        content={({ active, payload }: any) => {
                                            if (active && payload?.length) {
                                                return (
                                                    <div className="glass-panel-sm p-2 shadow-lg">
                                                        <p className="text-label-light">{payload[0].payload.name}</p>
                                                        <p className="text-sm font-bold text-[var(--foreground)] nums">
                                                            ${payload[0].value.toLocaleString()}
                                                        </p>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }}
                                        cursor={{ fill: 'var(--card-border)', opacity: 0.3 }}
                                    />
                                    <Bar dataKey="balance" radius={[0, 6, 6, 0]} isAnimationActive animationDuration={800}>
                                        {comparisonData.map((_, i) => (
                                            <Cell key={i} fill={barColors[i % barColors.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </GlassCard>
                </motion.div>
            </motion.div>
        </div>
    );
}
