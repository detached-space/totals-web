import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import GlassCard from "../shared/GlassCard";
import BudgetProgress from "../widgets/BudgetProgress";
import GoalCard from "../cards/GoalCard";
import AnimatedCounter from "../shared/AnimatedCounter";
import IncomeExpenseChart from "../charts/IncomeExpenseChart";
import { budgets, goals, totalBudgeted, totalBudgetSpent } from "../../lib/data";
import { bentoItemVariants } from "../layout/BentoGrid";
import { usePrivacy } from "../shared/PrivacyProvider";

const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.06 } },
};

const overallPercentage = Math.round((totalBudgetSpent / totalBudgeted) * 100);
const circumference = 2 * Math.PI * 50;
const offset = circumference - (overallPercentage / 100) * circumference;

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
                {/* Row 1: Budget Overview + Categories */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                    {/* Overall Budget Ring */}
                    <motion.div variants={bentoItemVariants}>
                        <GlassCard padding="lg" hoverLift={false} className="h-full flex flex-col items-center justify-center gap-4 cursor-pointer">
                            <p className="text-label-light">Monthly Budget</p>

                            <motion.div style={{ y: ringY }}>

                            <div className="relative w-32 h-32">
                                <svg className="w-full h-full -rotate-90" viewBox="0 0 110 110">
                                    <circle cx="55" cy="55" r="50" fill="none" stroke="var(--card-border)" strokeWidth="6" />
                                    <motion.circle
                                        cx="55" cy="55" r="50"
                                        fill="none"
                                        stroke={overallPercentage >= 90 ? '#ef4444' : overallPercentage >= 75 ? '#f59e0b' : '#10B981'}
                                        strokeWidth="6"
                                        strokeLinecap="round"
                                        strokeDasharray={circumference}
                                        initial={{ strokeDashoffset: circumference }}
                                        animate={{ strokeDashoffset: offset }}
                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-2xl font-bold text-[var(--foreground)]">{overallPercentage}%</span>
                                    <span className="text-[10px] text-[var(--muted)]">used</span>
                                </div>
                            </div>
                            </motion.div>

                            <div className="text-center">
                                <p className="text-sm text-[var(--muted)]">
                                    <AnimatedCounter value={totalBudgetSpent} prefix="$" decimals={0} className="font-bold text-[var(--foreground)]" />
                                    {' '}of <span className="nums">{hidden ? '••••' : `$${totalBudgeted.toLocaleString()}`}</span>
                                </p>
                                <p className="text-xs text-[var(--success)] mt-1">
                                    {hidden ? '•••• remaining' : `$${(totalBudgeted - totalBudgetSpent).toLocaleString()} remaining`}
                                </p>
                            </div>
                        </GlassCard>
                    </motion.div>

                    {/* Budget Categories */}
                    <motion.div variants={bentoItemVariants} className="lg:col-span-2">
                        <GlassCard padding="lg" hoverLift={false}>
                            <h3 className="text-subsection-title text-[var(--foreground)] mb-4">Budget Categories</h3>
                            <div className="space-y-1">
                                {budgets.map((budget) => (
                                    <BudgetProgress key={budget.category} budget={budget} />
                                ))}
                            </div>
                        </GlassCard>
                    </motion.div>
                </div>

                {/* Row 2: Budget vs Actual Chart */}
                <motion.div variants={bentoItemVariants}>
                    <GlassCard padding="lg" hoverLift={false}>
                        <h3 className="text-subsection-title text-[var(--foreground)] mb-4">Budget vs Actual</h3>
                        <IncomeExpenseChart height={250} />
                    </GlassCard>
                </motion.div>

                {/* Row 3: Savings Goals */}
                <motion.div variants={bentoItemVariants}>
                    <h3 className="text-subsection-title text-[var(--foreground)] mb-4">Savings Goals</h3>
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
