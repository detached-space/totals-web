import { motion } from "framer-motion";
import { Home, Plane, CreditCard, Zap, UtensilsCrossed } from "lucide-react";
import { usePrivacy } from "../shared/PrivacyProvider";
import type { Budget } from "../../lib/types";

const iconMap: Record<string, React.ElementType> = {
    Home, Plane, CreditCard, Zap, UtensilsCrossed,
};

interface BudgetProgressProps {
    budget: Budget;
}

export default function BudgetProgress({ budget }: BudgetProgressProps) {
    const { hidden } = usePrivacy();
    const Icon = iconMap[budget.icon] || CreditCard;
    const percentage = Math.min(Math.round((budget.spent / budget.budgeted) * 100), 100);
    const isOver = budget.spent >= budget.budgeted;
    const barColor = isOver ? 'var(--danger)' : budget.color;

    return (
        <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-[var(--foreground)]/3 transition-colors group">
            <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-shadow duration-300 group-hover:shadow-[0_0_20px_-5px_var(--stat-color)]"
                style={{ backgroundColor: `${budget.color}15`, color: budget.color, '--stat-color': budget.color } as React.CSSProperties}
            >
                <Icon size={20} />
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-body-title text-[var(--foreground)]">{budget.category}</span>
                    <span className="text-caption nums">
                        {hidden ? '•••• / ••••' : `$${budget.spent.toLocaleString()} / $${budget.budgeted.toLocaleString()}`}
                    </span>
                </div>

                {/* Progress bar with glowing endpoint */}
                <div className="relative h-2 rounded-full bg-[var(--foreground)]/5 overflow-visible">
                    <motion.div
                        className="h-full rounded-full relative"
                        style={{ backgroundColor: barColor }}
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        {/* Glowing dot at the end */}
                        <motion.div
                            className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full"
                            style={{
                                backgroundColor: barColor,
                                boxShadow: `0 0 10px ${barColor}, 0 0 20px ${barColor}50`,
                            }}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.6, type: 'spring', damping: 12 }}
                        />
                    </motion.div>
                </div>
            </div>

            <span className={`text-xs font-bold shrink-0 nums ${isOver ? 'text-[var(--danger)]' : 'text-[var(--muted)]'}`}>
                {percentage}%
            </span>
        </div>
    );
}
