import { motion } from "framer-motion";
import DonutChart from "../charts/DonutChart";
import { spendingCategories, totalSpending } from "../../lib/data";
import { formatCompact } from "../../lib/helpers";
import { bentoItemVariants } from "../layout/BentoGrid";

interface SpendingBreakdownProps {
    compact?: boolean;
    className?: string;
}

export default function SpendingBreakdown({ compact = false, className = '' }: SpendingBreakdownProps) {
    return (
        <motion.div
            variants={bentoItemVariants}
            className={`glass-panel p-5 ${className}`}
        >
            <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-[var(--foreground)]">Spending</p>
                <span className="text-xs text-[var(--muted)]">This month</span>
            </div>

            <DonutChart
                data={spendingCategories}
                centerLabel="Total"
                centerValue={`$${formatCompact(totalSpending)}`}
                size={compact ? 'sm' : 'md'}
            />

            {!compact && (
                <div className="grid grid-cols-2 gap-2 mt-4">
                    {spendingCategories.map((cat) => (
                        <div key={cat.name} className="flex items-center justify-between text-xs group">
                            <div className="flex items-center gap-2 text-[var(--muted)] group-hover:text-[var(--foreground)] transition-colors">
                                <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: cat.color }} />
                                <span className="truncate">{cat.name}</span>
                            </div>
                            <span className="font-medium text-[var(--foreground)]/80 ml-2">${cat.value}</span>
                        </div>
                    ))}
                </div>
            )}
        </motion.div>
    );
}
