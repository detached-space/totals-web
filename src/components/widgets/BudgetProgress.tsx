import { motion } from "framer-motion";
import { Home, Plane, CreditCard, Zap, UtensilsCrossed } from "lucide-react";
import type { Budget } from "../../lib/types";

const iconMap: Record<string, React.ElementType> = {
    Home, Plane, CreditCard, Zap, UtensilsCrossed,
};

interface BudgetProgressProps {
    budget: Budget;
}

export default function BudgetProgress({ budget }: BudgetProgressProps) {
    const Icon = iconMap[budget.icon] || CreditCard;
    const percentage = Math.min(Math.round((budget.spent / budget.budgeted) * 100), 100);
    const isOver = budget.spent >= budget.budgeted;

    return (
        <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-[var(--foreground)]/3 transition-colors">
            <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${budget.color}15`, color: budget.color }}
            >
                <Icon size={20} />
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-[var(--foreground)]">{budget.category}</span>
                    <span className="text-xs text-[var(--muted)]">
                        ${budget.spent.toLocaleString()} / ${budget.budgeted.toLocaleString()}
                    </span>
                </div>

                {/* Progress bar */}
                <div className="h-2 rounded-full bg-[var(--foreground)]/5 overflow-hidden">
                    <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: isOver ? 'var(--danger)' : budget.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                </div>
            </div>

            <span className={`text-xs font-bold shrink-0 ${isOver ? 'text-red-400' : 'text-[var(--muted)]'}`}>
                {percentage}%
            </span>
        </div>
    );
}
