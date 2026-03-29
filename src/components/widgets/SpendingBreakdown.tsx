import { motion } from "framer-motion";
import DonutChart from "../charts/DonutChart";
import { spendingCategories, totalSpending } from "../../lib/data";
import { formatCompact } from "../../lib/helpers";
import { bentoItemVariants } from "../layout/BentoGrid";
import { usePrivacy } from "../shared/PrivacyProvider";

interface SpendingBreakdownProps {
    compact?: boolean;
    className?: string;
}

export default function SpendingBreakdown({ compact = false, className = '' }: SpendingBreakdownProps) {
    const { hidden } = usePrivacy();
    return (
        <motion.div
            variants={bentoItemVariants}
            className={`glass-panel p-5 ${className}`}
        >
            <div className="flex items-center justify-between mb-3">
                <p className="text-body-title text-[var(--foreground)]">Spending</p>
                <span className="brutal-tag bg-[var(--pop-yellow)] text-[#1A1A2E]">This month</span>
            </div>

            <DonutChart
                data={spendingCategories}
                centerLabel="Total"
                centerValue={hidden ? '----' : `$${formatCompact(totalSpending)}`}
                size={compact ? 'sm' : 'md'}
            />

            {!compact && (
                <div className="grid grid-cols-2 gap-2 mt-4">
                    {spendingCategories.map((cat) => (
                        <div key={cat.name} className="flex items-center justify-between text-xs group">
                            <div className="flex items-center gap-2 text-[var(--muted)] group-hover:text-[var(--foreground)] transition-colors">
                                <div className="w-2 h-2 rounded-sm shrink-0 border border-[var(--card-border)]" style={{ background: cat.color }} />
                                <span className="truncate font-bold">{cat.name}</span>
                            </div>
                            <span className="font-black text-[var(--foreground)]/80 ml-2 nums">{hidden ? '----' : `$${cat.value}`}</span>
                        </div>
                    ))}
                </div>
            )}
        </motion.div>
    );
}
