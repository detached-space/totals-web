import { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import AccountCard from "../cards/AccountCard";
import GlassCard from "../shared/GlassCard";
import TransactionItem from "../widgets/TransactionItem";
import NetWorthChart from "../charts/NetWorthChart";
import DonutChart from "../charts/DonutChart";
import AnimatedCounter from "../shared/AnimatedCounter";
import { accounts, transactions, spendingCategories, totalBalance } from "../../lib/data";
import { bentoItemVariants } from "../layout/BentoGrid";
import { getLogo, getBankName, formatCompact } from "../../lib/helpers";
import { usePrivacy } from "../shared/PrivacyProvider";
import { ArrowRight, Landmark, ShieldCheck } from "lucide-react";

const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
};

// Cards slam in from below with rubber-band overshoot
const slamVariants = {
    hidden: { opacity: 0, y: 60, scale: 0.9 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            delay: 0.1 + i * 0.1,
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

// Letter animation for hero text
const letterVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: (i: number) => ({
        y: 0,
        opacity: 1,
        transition: {
            delay: i * 0.03,
            type: 'spring' as const,
            damping: 14,
            stiffness: 250,
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
    const label = "YOUR ACCOUNTS";
    const selectedColor = popColors[(selected.id) % popColors.length];

    return (
        <div ref={scrollRef} className="px-8 pb-8 max-w-[1600px] mx-auto">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-col gap-5"
            >
                {/* Hero: Total Balance Banner */}
                <motion.div
                    variants={bentoItemVariants}
                    whileHover={{ x: -4, y: -4, boxShadow: '8px 8px 0px var(--card-border)', transition: { duration: 0.1 } }}
                    whileTap={{ x: 2, y: 2, boxShadow: '0px 0px 0px var(--card-border)', transition: { duration: 0.05 } }}
                    className="brutal-card-blue p-6 relative overflow-hidden cursor-pointer"
                >
                    <div className="absolute top-0 right-0 w-14 h-14 bg-black/10 border-l-[var(--border-width)] border-b-[var(--border-width)] border-[var(--card-border)]" />

                    <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div>
                            <div className="flex gap-[2px] mb-1">
                                {label.split('').map((char, i) => (
                                    <motion.span
                                        key={i}
                                        custom={i}
                                        variants={letterVariants}
                                        initial="hidden"
                                        animate="visible"
                                        className="text-[10px] font-black tracking-[0.15em] text-[#1A1A2E]/50"
                                    >
                                        {char === ' ' ? '\u00A0' : char}
                                    </motion.span>
                                ))}
                            </div>

                            <div className="flex items-end gap-3">
                                <AnimatedCounter
                                    value={totalBalance}
                                    prefix="$"
                                    decimals={2}
                                    className="text-display-md text-[#1A1A2E] nums"
                                />
                                <motion.span
                                    initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                    transition={{ delay: 0.5, type: 'spring' as const, damping: 10, stiffness: 200 }}
                                    className="brutal-tag bg-[var(--pop-green)] text-[#1A1A2E] mb-1 shadow-[2px_2px_0px_rgba(0,0,0,0.3)]"
                                >
                                    {accounts.length} connected
                                </motion.span>
                            </div>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="flex items-center gap-3"
                        >
                            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-black/10 border border-black/15">
                                <div className="w-7 h-7 rounded-md bg-[var(--pop-yellow)] flex items-center justify-center border-[var(--border-width)] border-[var(--card-border)]">
                                    <Landmark size={14} className="text-[#1A1A2E]" />
                                </div>
                                <div>
                                    <p className="text-[9px] font-black uppercase tracking-wider text-[#1A1A2E]/40">Banks</p>
                                    <p className="text-sm font-black text-[#1A1A2E] nums">{accounts.length}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-black/10 border border-black/15">
                                <div className="w-7 h-7 rounded-md bg-[var(--pop-green)] flex items-center justify-center border-[var(--border-width)] border-[var(--card-border)]">
                                    <ShieldCheck size={14} className="text-[#1A1A2E]" />
                                </div>
                                <div>
                                    <p className="text-[9px] font-black uppercase tracking-wider text-[#1A1A2E]/40">Status</p>
                                    <p className="text-sm font-black text-[#1A1A2E]">All Active</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Card Carousel with slam-in */}
                <motion.div variants={bentoItemVariants}>
                    <motion.div style={{ y: carouselY }}>
                        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory -mx-2 px-2">
                            {accounts.map((acc, i) => (
                                <motion.div
                                    key={acc.id}
                                    custom={i}
                                    variants={slamVariants}
                                    initial="hidden"
                                    animate="visible"
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
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </motion.div>

                {/* Selected Account Detail */}
                <motion.div
                    key={selectedId}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
                    className="grid grid-cols-1 lg:grid-cols-3 gap-5"
                >
                        {/* Balance Trend */}
                        <div className="lg:col-span-2">
                            <GlassCard padding="lg" hoverLift={false} className="h-full">
                                <div className="flex items-center gap-3 mb-4">
                                    <motion.div
                                        initial={{ scale: 0, rotate: -45 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        transition={{ type: 'spring' as const, damping: 10, stiffness: 250 }}
                                        className="w-10 h-10 rounded-lg border-[var(--border-width)] border-[var(--card-border)] flex items-center justify-center shadow-[3px_3px_0px_var(--card-border)]"
                                        style={{ backgroundColor: selectedColor }}
                                    >
                                        <img src={getLogo(selected.id)} alt="" className="w-5 h-5" />
                                    </motion.div>
                                    <div>
                                        <h3 className="text-subsection-title text-[var(--foreground)]">{selected.name}</h3>
                                        <span className="text-[10px] font-black text-[var(--muted)] uppercase tracking-wider">Balance Trend</span>
                                    </div>
                                    <motion.span
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 }}
                                        className="brutal-tag ml-auto"
                                        style={{ backgroundColor: selectedColor, color: '#1A1A2E' }}
                                    >
                                        Active
                                    </motion.span>
                                </div>
                                <div className="cursor-crosshair" style={{ height: 260 }}>
                                    <NetWorthChart height={260} showHeader={false} />
                                </div>
                            </GlassCard>
                        </div>

                        {/* Account Info — staggered reveal */}
                        <div>
                            <GlassCard padding="lg" hoverLift={false} className="h-full flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <p className="text-overline">Account Details</p>
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: 0.2, type: 'spring' as const, damping: 10, stiffness: 200 }}
                                        >
                                            <ArrowRight size={14} className="text-[var(--muted)]" />
                                        </motion.div>
                                    </div>
                                    <div className="space-y-4">
                                        {[
                                            { label: "Bank", value: selected.name },
                                            { label: "Account Number", value: selected.accountNumber, mono: true },
                                        ].map((item, i) => (
                                            <motion.div
                                                key={item.label}
                                                initial={{ opacity: 0, x: -15 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.1 + i * 0.1, type: 'spring' as const, damping: 20, stiffness: 300 }}
                                            >
                                                <p className="text-label-light">{item.label}</p>
                                                <p className={`text-sm font-bold text-[var(--foreground)] ${item.mono ? 'font-mono' : ''}`}>{item.value}</p>
                                            </motion.div>
                                        ))}

                                        <motion.div
                                            initial={{ opacity: 0, x: -15 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.3, type: 'spring' as const, damping: 20, stiffness: 300 }}
                                        >
                                            <p className="text-label-light">Balance</p>
                                            <AnimatedCounter
                                                value={selected.balance}
                                                prefix="$"
                                                decimals={2}
                                                className="text-display-sm nums text-[var(--foreground)]"
                                            />
                                        </motion.div>

                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.4, type: 'spring' as const, damping: 12, stiffness: 200 }}
                                        >
                                            <p className="text-label-light">Status</p>
                                            <span
                                                className="brutal-tag mt-1 inline-flex shadow-[2px_2px_0px_var(--card-border)]"
                                                style={{ backgroundColor: selectedColor, color: '#1A1A2E' }}
                                            >
                                                Active
                                            </span>
                                        </motion.div>
                                    </div>
                                </div>
                            </GlassCard>
                        </div>
                    </motion.div>
                {/* Transactions + Spending */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                    <motion.div variants={bentoItemVariants} className="lg:col-span-2">
                        <GlassCard padding="lg" hoverLift={false}>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-subsection-title text-[var(--foreground)]">Recent Transactions</h3>
                                <span className="brutal-tag bg-[var(--pop-orange)] text-[#1A1A2E]">
                                    {accountTransactions.length} found
                                </span>
                            </div>
                            {accountTransactions.length > 0 ? (
                                <div className="space-y-1">
                                    {accountTransactions.map((t, i) => (
                                        <motion.div
                                            key={`${selectedId}-${i}`}
                                            custom={i}
                                            variants={txVariants}
                                            initial="hidden"
                                            whileInView="visible"
                                            viewport={{ once: true }}
                                        >
                                            <TransactionItem transaction={t} />
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-sm text-[var(--muted)] py-8 text-center"
                                >
                                    No transactions for this account
                                </motion.p>
                            )}
                        </GlassCard>
                    </motion.div>

                    <motion.div variants={bentoItemVariants}>
                        <GlassCard padding="lg" hoverLift={false} className="h-full">
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-body-title text-[var(--foreground)]">Spending by Category</p>
                                <span className="brutal-tag bg-[var(--pop-pink)] text-white text-[9px]">
                                    {spendingCategories.length} categories
                                </span>
                            </div>
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
                                const isSelected = acc.id === selectedId;
                                return (
                                    <motion.div
                                        key={acc.id}
                                        custom={i}
                                        variants={barItemVariants}
                                        initial="hidden"
                                        whileInView="visible"
                                        viewport={{ once: true }}
                                        whileHover={{ x: 4, transition: { duration: 0.1 } }}
                                        className={`flex items-center gap-3 cursor-pointer group p-2 rounded-lg transition-colors ${isSelected ? 'bg-[var(--muted-fill)]' : ''}`}
                                        onClick={() => setSelectedId(acc.id)}
                                    >
                                        <motion.div
                                            className="w-9 h-9 rounded-md border-[var(--border-width)] border-[var(--card-border)] flex items-center justify-center shrink-0"
                                            style={{ backgroundColor: isSelected ? popColors[i % popColors.length] : 'var(--muted-fill)' }}
                                            animate={{ scale: isSelected ? 1.1 : 1 }}
                                            transition={{ type: 'spring' as const, damping: 15, stiffness: 300 }}
                                        >
                                            <img src={getLogo(acc.id)} alt="" className="w-4.5 h-4.5" />
                                        </motion.div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className={`text-xs font-bold truncate transition-colors ${isSelected ? 'text-[var(--accent)]' : 'text-[var(--foreground)] group-hover:text-[var(--accent)]'}`}>
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
