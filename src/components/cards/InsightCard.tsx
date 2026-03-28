import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { bentoItemVariants } from "../layout/BentoGrid";

interface InsightCardProps {
    message: string;
    type?: 'info' | 'warning' | 'success';
    className?: string;
}

const accentColors = {
    info: { border: 'border-l-blue-500', bg: 'bg-blue-500/10', text: 'text-blue-400' },
    warning: { border: 'border-l-amber-500', bg: 'bg-amber-500/10', text: 'text-amber-400' },
    success: { border: 'border-l-emerald-500', bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
};

export default function InsightCard({ message, type = 'info', className = '' }: InsightCardProps) {
    const colors = accentColors[type];

    return (
        <motion.div
            variants={bentoItemVariants}
            className={`glass-panel p-5 border-l-2 ${colors.border} ${className}`}
        >
            <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg ${colors.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                    <Sparkles size={16} className={colors.text} />
                </div>
                <div>
                    <p className="text-xs text-[var(--muted)] mb-1 font-medium">Insight</p>
                    <p className="text-sm text-[var(--foreground)] leading-relaxed">{message}</p>
                </div>
            </div>
        </motion.div>
    );
}
