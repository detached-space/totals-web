import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import GlassCard from "../shared/GlassCard";
import BudgetProgress from "../widgets/BudgetProgress";
import GoalCard from "../cards/GoalCard";
import AnimatedCounter from "../shared/AnimatedCounter";
import PillBarChart from "../charts/PillBarChart";
import { budgets, goals, totalBudgeted, totalBudgetSpent, monthlyBudgetTracking } from "../../lib/data";
import { bentoItemVariants } from "../layout/BentoGrid";
import { usePrivacy } from "../shared/PrivacyProvider";
import { Flame, Target, TrendingDown } from "lucide-react";

const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.06 } },
};

const overallPercentage = Math.round((totalBudgetSpent / totalBudgeted) * 100);
const remaining = totalBudgeted - totalBudgetSpent;

// Quick stats
const onTrackCount = budgets.filter(b => b.spent / b.budgeted < 0.85).length;
const warningCount = budgets.filter(b => b.spent / b.budgeted >= 0.85 && b.spent < b.budgeted).length;
const overCount = budgets.filter(b => b.spent >= b.budgeted).length;

export default function BudgetPage() {
    const { hidden } = usePrivacy();
    const scrollRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: scrollRef, offset: ["start start", "end start"] });
    const ringY = useTransform(scrollYProgress, [0, 1], [0, -30]);

    return (
        <div ref={scrollRef} className="px-8 pb-8 max-w-[1600px] mx-auto">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-col gap-5"
            >
                {/* Row 1: Hero budget overview — colorful card like the inspiration */}
                <motion.div
                    variants={bentoItemVariants}
                    whileHover={{ x: -4, y: -4, boxShadow: '8px 8px 0px var(--card-border)', transition: { duration: 0.1 } }}
                    whileTap={{ x: 2, y: 2, boxShadow: '0px 0px 0px var(--card-border)', transition: { duration: 0.05 } }}
                    className="brutal-card-accent p-6 relative overflow-hidden cursor-pointer"
                >
                    <div className="absolute top-0 right-0 w-14 h-14 bg-white/10 border-l-[var(--border-width)] border-b-[var(--border-width)] border-[var(--card-border)]" />

                    <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        {/* Left: Total spending */}
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-[10px] font-black tracking-[0.15em] text-white/50 uppercase">Monthly Budget</span>
                                <span className="brutal-tag bg-[var(--pop-yellow)] text-[#1A1A2E] text-[9px]">March 2026</span>
                            </div>

                            <div className="flex items-end gap-3">
                                <AnimatedCounter
                                    value={totalBudgetSpent}
                                    prefix="$"
                                    decimals={0}
                                    className="text-display-md text-white nums"
                                />
                                <span className="text-sm font-bold text-white/40 mb-1">
                                    of {hidden ? '••••' : `$${totalBudgeted.toLocaleString()}`}
                                </span>
                            </div>

                            <motion.p
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 }}
                                className="text-xs font-black text-[var(--pop-green)] mt-1"
                            >
                                {hidden ? '•••• remaining' : `$${remaining.toLocaleString()} remaining`}
                            </motion.p>
                        </div>

                        {/* Right: Quick stat pills */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="flex items-center gap-3"
                        >
                            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 border border-white/15">
                                <div className="w-7 h-7 rounded-md bg-[var(--pop-green)] flex items-center justify-center border-[var(--border-width)] border-[var(--card-border)]">
                                    <Target size={14} className="text-[#1A1A2E]" />
                                </div>
                                <div>
                                    <p className="text-[9px] font-black uppercase tracking-wider text-white/40">On Track</p>
                                    <p className="text-sm font-black text-white nums">{onTrackCount}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 border border-white/15">
                                <div className="w-7 h-7 rounded-md bg-[var(--pop-orange)] flex items-center justify-center border-[var(--border-width)] border-[var(--card-border)]">
                                    <Flame size={14} className="text-[#1A1A2E]" />
                                </div>
                                <div>
                                    <p className="text-[9px] font-black uppercase tracking-wider text-white/40">Warning</p>
                                    <p className="text-sm font-black text-white nums">{warningCount}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 border border-white/15">
                                <div className="w-7 h-7 rounded-md bg-[var(--danger)] flex items-center justify-center border-[var(--border-width)] border-[var(--card-border)]">
                                    <TrendingDown size={14} className="text-white" />
                                </div>
                                <div>
                                    <p className="text-[9px] font-black uppercase tracking-wider text-white/40">Over</p>
                                    <p className="text-sm font-black text-white nums">{overCount}</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Bottom progress bar */}
                    <div className="relative z-10 mt-4 pt-3 border-t border-white/10">
                        <div className="h-3 rounded-full bg-white/10 border border-white/15 overflow-hidden">
                            <motion.div
                                className="h-full rounded-full"
                                style={{
                                    backgroundColor: overallPercentage >= 90 ? 'var(--danger)' : overallPercentage >= 75 ? 'var(--pop-orange)' : 'var(--pop-green)',
                                }}
                                initial={{ width: 0 }}
                                animate={{ width: `${overallPercentage}%` }}
                                transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
                            />
                        </div>
                        <div className="flex items-center justify-between mt-1">
                            <span className="text-[10px] font-bold text-white/40">{overallPercentage}% used</span>
                            <span className="text-[10px] font-bold text-white/40">{100 - overallPercentage}% left</span>
                        </div>
                    </div>
                </motion.div>

                {/* Row 2: Pill Bar Chart + Budget Categories */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
                    {/* Pill Bar Chart — monthly budget vs spending */}
                    <motion.div variants={bentoItemVariants} className="lg:col-span-2">
                        <GlassCard padding="lg" hoverLift={false} className="h-full">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-subsection-title text-[var(--foreground)]">Monthly Tracking</h3>
                                <span className="brutal-tag bg-[var(--pop-purple)] text-[#1A1A2E]">7 months</span>
                            </div>

                            <motion.div style={{ y: ringY }}>
                                <PillBarChart data={monthlyBudgetTracking} height={220} />
                            </motion.div>

                            <div className="flex items-center justify-center gap-4 mt-4 pt-3 border-t border-[var(--card-border)]">
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-[var(--card-border)]" />
                                    <span className="text-[10px] font-bold text-[var(--muted)]">Budget</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-[var(--pop-blue)]" />
                                    <span className="text-[10px] font-bold text-[var(--muted)]">Spent</span>
                                </div>
                            </div>
                        </GlassCard>
                    </motion.div>

                    {/* Budget Categories */}
                    <motion.div variants={bentoItemVariants} className="lg:col-span-3">
                        <GlassCard padding="lg" hoverLift={false}>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-subsection-title text-[var(--foreground)]">Budget Categories</h3>
                                <span className="text-[10px] font-black text-[var(--muted)] nums">{budgets.length} categories</span>
                            </div>
                            <div className="space-y-1">
                                {budgets.map((budget) => (
                                    <BudgetProgress key={budget.category} budget={budget} />
                                ))}
                            </div>
                        </GlassCard>
                    </motion.div>
                </div>

                {/* Row 3: Savings Goals */}
                <motion.div variants={bentoItemVariants}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-subsection-title text-[var(--foreground)]">Savings Goals</h3>
                        <span className="brutal-tag bg-[var(--pop-blue)] text-[#1A1A2E]">{goals.length} active</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {goals.map((goal) => (
                            <GoalCard key={goal.id} goal={goal} />
                        ))}
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}
