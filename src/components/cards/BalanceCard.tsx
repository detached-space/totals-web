import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Zap, ArrowUpRight, ArrowDownLeft, Repeat } from "lucide-react";
import AnimatedCounter from "../shared/AnimatedCounter";
import { bentoItemVariants } from "../layout/BentoGrid";

interface BalanceCardProps {
    total: number;
    trend?: number;
    income?: number;
    expenses?: number;
}

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

export default function BalanceCard({ total, trend = 12.5, income = 13000, expenses = 2393 }: BalanceCardProps) {
    const isPositive = trend >= 0;
    const label = "TOTAL BALANCE";

    return (
        <motion.div
            variants={bentoItemVariants}
            whileHover={{ x: -4, y: -4, boxShadow: '8px 8px 0px var(--card-border)', transition: { duration: 0.1 } }}
            whileTap={{ x: 2, y: 2, boxShadow: '0px 0px 0px var(--card-border)', transition: { duration: 0.05 } }}
            className="brutal-card-accent p-6 relative overflow-hidden cursor-pointer"
        >
            {/* Decorative corner block */}
            <div className="absolute top-0 right-0 w-14 h-14 bg-white/10 border-l-[var(--border-width)] border-b-[var(--border-width)] border-[var(--card-border)]" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* Left: Balance */}
                <div>
                    <div className="flex gap-[2px] mb-1">
                        {label.split('').map((char, i) => (
                            <motion.span
                                key={i}
                                custom={i}
                                variants={letterVariants}
                                initial="hidden"
                                animate="visible"
                                className="text-[10px] font-black tracking-[0.15em] text-white/50"
                            >
                                {char === ' ' ? '\u00A0' : char}
                            </motion.span>
                        ))}
                    </div>

                    <div className="flex items-end gap-3">
                        <AnimatedCounter
                            value={total}
                            prefix="$"
                            decimals={2}
                            className="text-display-md text-white nums"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            transition={{ delay: 0.5, type: 'spring' as const, damping: 10, stiffness: 200 }}
                            className={`flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-black mb-1 border-[var(--border-width)] border-[var(--card-border)] shadow-[2px_2px_0px_rgba(0,0,0,0.3)] ${
                                isPositive ? 'bg-[var(--pop-green)] text-[#1A1A2E]' : 'bg-[var(--danger)] text-white'
                            }`}
                        >
                            {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                            {isPositive ? '+' : ''}{trend}%
                        </motion.div>
                    </div>
                </div>

                {/* Right: Quick stats row */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex items-center gap-3"
                >
                    {/* Income mini */}
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 border border-white/15">
                        <div className="w-7 h-7 rounded-md bg-[var(--pop-green)] flex items-center justify-center border-[var(--border-width)] border-[var(--card-border)]">
                            <ArrowDownLeft size={14} className="text-[#1A1A2E]" />
                        </div>
                        <div>
                            <p className="text-[9px] font-black uppercase tracking-wider text-white/40">In</p>
                            <p className="text-sm font-black text-white nums">${income.toLocaleString()}</p>
                        </div>
                    </div>

                    {/* Expense mini */}
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 border border-white/15">
                        <div className="w-7 h-7 rounded-md bg-[var(--danger)] flex items-center justify-center border-[var(--border-width)] border-[var(--card-border)]">
                            <ArrowUpRight size={14} className="text-white" />
                        </div>
                        <div>
                            <p className="text-[9px] font-black uppercase tracking-wider text-white/40">Out</p>
                            <p className="text-sm font-black text-white nums">${expenses.toLocaleString()}</p>
                        </div>
                    </div>

                    {/* Net mini */}
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 border border-white/15">
                        <div className="w-7 h-7 rounded-md bg-[var(--pop-yellow)] flex items-center justify-center border-[var(--border-width)] border-[var(--card-border)]">
                            <Repeat size={14} className="text-[#1A1A2E]" />
                        </div>
                        <div>
                            <p className="text-[9px] font-black uppercase tracking-wider text-white/40">Net</p>
                            <p className="text-sm font-black text-white nums">${(income - expenses).toLocaleString()}</p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Bottom strip */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="flex items-center gap-2 mt-3 pt-2 border-t border-white/10"
            >
                <Zap size={12} className="text-[var(--pop-yellow)]" />
                <span className="text-[10px] font-bold text-white/40">Updated just now · 5 accounts connected</span>
            </motion.div>
        </motion.div>
    );
}
