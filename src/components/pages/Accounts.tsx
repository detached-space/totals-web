import { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import AccountCard from "../cards/AccountCard";
import GlassCard from "../shared/GlassCard";
import TransactionItem from "../widgets/TransactionItem";
import NetWorthChart from "../charts/NetWorthChart";
import DonutChart from "../charts/DonutChart";
import { accounts, transactions, spendingCategories, totalBalance } from "../../lib/data";
import { bentoItemVariants } from "../layout/BentoGrid";
import { getLogo, getBankName, formatCurrency, formatCompact } from "../../lib/helpers";
import { usePrivacy } from "../shared/PrivacyProvider";
const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] } },
};

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

export default function Accounts() {
    const { hidden } = usePrivacy();
    const scrollRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: scrollRef, offset: ["start start", "end start"] });
    const carouselY = useTransform(scrollYProgress, [0, 1], [0, -40]);
    const [selectedId, setSelectedId] = useState(accounts[0].id);
    const selected = accounts.find(a => a.id === selectedId) || accounts[0];
    const accountTransactions = transactions.filter(t => t.bankId === selectedId).slice(0, 6);
    const sortedAccounts = [...accounts].sort((a, b) => b.balance - a.balance);
    const maxBalance = sortedAccounts[0]?.balance || 1;

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
                                        <span className="brutal-tag bg-[var(--success)] text-[#1A1A2E] mt-1 inline-flex">Active</span>
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

                {/* Account Breakdown */}
                <motion.div variants={bentoItemVariants}>
                    <GlassCard padding="lg" hoverLift={false}>
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-subsection-title text-[var(--foreground)]">Account Breakdown</h3>
                            <span className="brutal-tag bg-[var(--pop-purple)] text-[#1A1A2E]">
                                {accounts.length} accounts
                            </span>
                        </div>
                        <div className="space-y-4">
                            {sortedAccounts.map((acc, i) => {
                                const pct = (acc.balance / maxBalance) * 100;
                                const share = Math.round((acc.balance / totalBalance) * 100);
                                return (
                                    <motion.div
                                        key={acc.id}
                                        custom={i}
                                        variants={barItemVariants}
                                        initial="hidden"
                                        whileInView="visible"
                                        viewport={{ once: true }}
                                        className="flex items-center gap-3 cursor-pointer group"
                                        onClick={() => setSelectedId(acc.id)}
                                    >
                                        <div className="w-8 h-8 rounded-md border-[var(--border-width)] border-[var(--card-border)] flex items-center justify-center bg-[var(--muted-fill)] shrink-0">
                                            <img src={getLogo(acc.id)} alt="" className="w-4.5 h-4.5" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-xs font-bold text-[var(--foreground)] truncate group-hover:text-[var(--accent)] transition-colors">
                                                    {getBankName(acc.id)}
                                                </span>
                                                <div className="flex items-center gap-2 shrink-0 ml-2">
                                                    <span className="text-xs font-black text-[var(--foreground)] nums">
                                                        {hidden ? '••••' : `$${formatCompact(acc.balance)}`}
                                                    </span>
                                                    <span className="text-[10px] font-bold text-[var(--muted)]">
                                                        {share}%
                                                    </span>
                                                </div>
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
            </motion.div>
        </div>
    );
}
