import { motion } from "framer-motion";
import { Shield, Plane, Laptop } from "lucide-react";
import { formatCurrency } from "../../lib/helpers";
import { usePrivacy } from "../shared/PrivacyProvider";
import type { Goal } from "../../lib/types";

const iconMap: Record<string, React.ElementType> = {
    Shield, Plane, Laptop,
};

interface GoalCardProps {
    goal: Goal;
}

export default function GoalCard({ goal }: GoalCardProps) {
    const { hidden } = usePrivacy();
    const Icon = iconMap[goal.icon] || Shield;
    const percentage = Math.round((goal.current / goal.target) * 100);
    const circumference = 2 * Math.PI * 36;
    const offset = circumference - (percentage / 100) * circumference;

    // Calculate endpoint position for glow dot
    const angle = (percentage / 100) * 360 - 90; // -90 because SVG starts at top
    const rad = (angle * Math.PI) / 180;
    const endX = 40 + 36 * Math.cos(rad);
    const endY = 40 + 36 * Math.sin(rad);

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4, transition: { type: 'spring', damping: 20, stiffness: 300 } }}
            whileTap={{ scale: 0.97, transition: { type: 'spring', damping: 15, stiffness: 400 } }}
            className="glass-panel p-5 flex flex-col items-center gap-3 group cursor-pointer"
        >
            {/* Progress Ring with Glow Endpoint */}
            <div className="relative w-20 h-20">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
                    <defs>
                        <filter id={`glow-${goal.id}`} x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="3" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>
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
                    {/* Glowing endpoint dot */}
                    <motion.circle
                        cx={endX} cy={endY} r="4"
                        fill={goal.color}
                        filter={`url(#glow-${goal.id})`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 0.4 }}
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <Icon size={20} style={{ color: goal.color }} />
                </div>
            </div>

            <div className="text-center">
                <p className="text-body-title text-[var(--foreground)]">{goal.title}</p>
                <p className="text-caption mt-1">
                    {hidden ? '•••• / ••••' : `${formatCurrency(goal.current)} / ${formatCurrency(goal.target)}`}
                </p>
                <p className="text-xs font-bold mt-1 nums" style={{ color: goal.color }}>{percentage}%</p>
            </div>
        </motion.div>
    );
}
