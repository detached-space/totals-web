import { motion } from "framer-motion";
import { Shield, Plane, Laptop } from "lucide-react";
import { formatCurrency } from "../../lib/helpers";
import type { Goal } from "../../lib/types";

const iconMap: Record<string, React.ElementType> = {
    Shield, Plane, Laptop,
};

interface GoalCardProps {
    goal: Goal;
}

export default function GoalCard({ goal }: GoalCardProps) {
    const Icon = iconMap[goal.icon] || Shield;
    const percentage = Math.round((goal.current / goal.target) * 100);
    const circumference = 2 * Math.PI * 36;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-5 flex flex-col items-center gap-3"
        >
            {/* Progress Ring */}
            <div className="relative w-20 h-20">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
                    <circle
                        cx="40" cy="40" r="36"
                        fill="none"
                        stroke="var(--card-border)"
                        strokeWidth="4"
                    />
                    <motion.circle
                        cx="40" cy="40" r="36"
                        fill="none"
                        stroke={goal.color}
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: offset }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <Icon size={20} style={{ color: goal.color }} />
                </div>
            </div>

            <div className="text-center">
                <p className="text-sm font-semibold text-[var(--foreground)]">{goal.title}</p>
                <p className="text-xs text-[var(--muted)] mt-1">
                    {formatCurrency(goal.current)} / {formatCurrency(goal.target)}
                </p>
                <p className="text-xs font-bold mt-1" style={{ color: goal.color }}>{percentage}%</p>
            </div>
        </motion.div>
    );
}
