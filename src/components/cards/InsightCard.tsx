import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { bentoItemVariants } from "../layout/BentoGrid";

interface InsightCardProps {
    message: string;
    type?: 'info' | 'warning' | 'success';
    className?: string;
}

const accentColors = {
    info: { border: 'border-l-blue-500', bg: 'bg-blue-500/10', text: 'text-blue-400', glow: 'rgba(59,130,246,0.3)' },
    warning: { border: 'border-l-amber-500', bg: 'bg-amber-500/10', text: 'text-amber-400', glow: 'rgba(245,158,11,0.3)' },
    success: { border: 'border-l-[var(--success)]', bg: 'bg-[var(--success)]/10', text: 'text-[var(--success)]', glow: 'rgba(16,185,129,0.3)' },
};

export default function InsightCard({ message, type = 'info', className = '' }: InsightCardProps) {
    const colors = accentColors[type];

    return (
        <motion.div
            variants={bentoItemVariants}
            whileHover={{ y: -2, transition: { type: 'spring', damping: 20, stiffness: 300 } }}
            className={`glass-panel p-5 border-l-2 ${colors.border} group ${className}`}
        >
            <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg ${colors.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                    <Sparkles size={16} className={colors.text} />
                </div>
                <div>
                    <p className="text-label-light mb-1">Insight</p>
                    <p className="text-body text-[var(--foreground)] leading-relaxed">{message}</p>
                </div>
            </div>
        </motion.div>
    );
}
