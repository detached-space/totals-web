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

const cardBgs = ['var(--pop-blue)', 'var(--pop-yellow)', 'var(--pop-purple)'];

export default function GoalCard({ goal }: GoalCardProps) {
    const { hidden } = usePrivacy();
    const Icon = iconMap[goal.icon] || Shield;
    const percentage = Math.round((goal.current / goal.target) * 100);
    const circumference = 2 * Math.PI * 36;
    const offset = circumference - (percentage / 100) * circumference;
    const bgColor = cardBgs[(goal.id - 1) % cardBgs.length];

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ x: -4, y: -4, boxShadow: '8px 8px 0px var(--card-border)', transition: { duration: 0.1 } }}
            whileTap={{ x: 2, y: 2, boxShadow: '0px 0px 0px var(--card-border)', transition: { duration: 0.05 } }}
            className="rounded-lg p-5 flex flex-col items-center gap-3 cursor-pointer border-[var(--border-width)] border-[var(--card-border)] shadow-[var(--shadow-brutal)] relative overflow-hidden"
            style={{ backgroundColor: bgColor }}
        >
            {/* Decorative corner */}
            <div className="absolute top-0 right-0 w-10 h-10 bg-black/10 border-l-[var(--border-width)] border-b-[var(--border-width)] border-[var(--card-border)]" />

            {/* Progress Ring */}
            <div className="relative w-20 h-20">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
                    <circle
                        cx="40" cy="40" r="36"
                        fill="none"
                        stroke="rgba(26,26,46,0.2)"
                        strokeWidth="5"
                    />
                    <motion.circle
                        cx="40" cy="40" r="36"
                        fill="none"
                        stroke="#1A1A2E"
                        strokeWidth="5"
                        strokeLinecap="butt"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: offset }}
                        transition={{ duration: 1, ease: "easeOut" }}
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <Icon size={20} className="text-[#1A1A2E]" />
                </div>
            </div>

            <div className="text-center relative z-10">
                <p className="text-sm font-black text-[#1A1A2E]">{goal.title}</p>
                <p className="text-xs font-bold text-[#1A1A2E]/60 mt-1">
                    {hidden ? '---- / ----' : `${formatCurrency(goal.current)} / ${formatCurrency(goal.target)}`}
                </p>
                <span className="inline-block mt-2 text-xs font-black nums px-3 py-1 rounded-full border-[var(--border-width)] border-[#1A1A2E] bg-white/30 text-[#1A1A2E] shadow-[2px_2px_0px_rgba(26,26,46,0.3)]">
                    {percentage}%
                </span>
            </div>
        </motion.div>
    );
}
