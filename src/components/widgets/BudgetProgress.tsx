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
    const Icon = iconMap[budget.icon || ''] || CreditCard;

    // Handle both API and mock data shapes
    const spent = budget.status?.spent ?? budget.spent ?? 0;
    const budgeted = budget.amount ?? budget.budgeted ?? 0;
    const percentage = budgeted > 0 ? Math.min(Math.round((spent / budgeted) * 100), 100) : 0;
    const isOver = spent >= budgeted;
    const barColor = isOver ? 'var(--danger)' : (budget.color || 'var(--pop-blue)');
    const categoryName = budget.category || budget.name || 'Budget';

    return (
        <div className="flex items-center gap-4 p-4 rounded-lg hover:bg-[var(--muted-fill)] transition-colors group">
            <div
                className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border-[var(--border-width)] border-[var(--card-border)]"
                style={{ backgroundColor: barColor, color: '#1A1A2E' }}
            >
                <Icon size={20} />
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-body-title text-[var(--foreground)]">{categoryName}</span>
                    <span className="text-caption nums font-bold">
                        {hidden ? '---- / ----' : `$${spent.toLocaleString()} / $${budgeted.toLocaleString()}`}
                    </span>
                </div>

                {/* Progress bar — flat, no glow */}
                <div className="relative h-3 rounded-sm bg-[var(--muted-fill)] border-[var(--border-width)] border-[var(--card-border)] overflow-hidden">
                    <motion.div
                        className="h-full"
                        style={{ backgroundColor: barColor }}
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    />
                </div>
            </div>

            <span className={`text-xs font-black shrink-0 nums px-2 py-0.5 rounded-md border-[var(--border-width)] border-[var(--card-border)] ${
                isOver ? 'bg-[var(--danger)] text-white' : 'bg-[var(--muted-fill)] text-[var(--muted)]'
            }`}>
                {percentage}%
            </span>
        </div>
    );
}
