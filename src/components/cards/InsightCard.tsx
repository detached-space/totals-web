import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { bentoItemVariants } from "../layout/BentoGrid";

interface InsightCardProps {
    message: string;
    type?: 'info' | 'warning' | 'success';
    className?: string;
}

const accentColors = {
    info: { bg: 'var(--pop-blue)', text: '#1A1A2E' },
    warning: { bg: 'var(--pop-yellow)', text: '#1A1A2E' },
    success: { bg: 'var(--pop-green)', text: '#1A1A2E' },
};

// Word-by-word stagger
const wordVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: 0.3 + i * 0.04, duration: 0.2 },
    }),
};

export default function InsightCard({ message, type = 'info', className = '' }: InsightCardProps) {
    const colors = accentColors[type];
    const words = message.split(' ');

    return (
        <motion.div
            variants={bentoItemVariants}
            whileHover={{ x: -2, y: -2, transition: { duration: 0.1 } }}
            className={`glass-panel p-4 border-l-4 cursor-pointer flex items-center gap-3 ${className}`}
            style={{ borderLeftColor: colors.bg }}
        >
            <motion.div
                initial={{ rotate: -20, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ delay: 0.15, type: 'spring' as const, damping: 8, stiffness: 200 }}
                className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border-[var(--border-width)] border-[var(--card-border)] shadow-[2px_2px_0px_var(--card-border)]"
                style={{ backgroundColor: colors.bg, color: colors.text }}
            >
                <Sparkles size={18} />
            </motion.div>
            <div className="min-w-0">
                <p className="text-[10px] font-black uppercase tracking-widest text-[var(--muted)] mb-0.5">Insight</p>
                <p className="text-sm text-[var(--foreground)] leading-snug font-medium">
                    {words.map((word, i) => (
                        <motion.span
                            key={i}
                            custom={i}
                            variants={wordVariants}
                            initial="hidden"
                            animate="visible"
                            className="inline-block mr-[4px]"
                        >
                            {word}
                        </motion.span>
                    ))}
                </p>
            </div>
        </motion.div>
    );
}
