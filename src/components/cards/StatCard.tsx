import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, type LucideIcon } from "lucide-react";
import AnimatedCounter from "../shared/AnimatedCounter";
import { bentoItemVariants } from "../layout/BentoGrid";

interface StatCardProps {
    title: string;
    value: number;
    prefix?: string;
    suffix?: string;
    decimals?: number;
    icon: LucideIcon;
    trend?: number;
    color?: string;
    className?: string;
}

export default function StatCard({
    title,
    value,
    prefix = "$",
    suffix = "",
    decimals = 0,
    icon: Icon,
    trend,
    color = "var(--accent)",
    className = "",
}: StatCardProps) {
    const isPositive = trend !== undefined ? trend >= 0 : true;

    return (
        <motion.div
            variants={bentoItemVariants}
            whileHover={{
                x: -3,
                y: -3,
                boxShadow: '6px 6px 0px var(--card-border)',
                transition: { duration: 0.1 },
            }}
            whileTap={{
                x: 2,
                y: 2,
                boxShadow: '0px 0px 0px var(--card-border)',
                transition: { duration: 0.05 },
            }}
            className={`glass-panel p-5 flex items-center gap-4 cursor-pointer ${className}`}
        >
            {/* Icon with bounce-in */}
            <motion.div
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: 'spring' as const, damping: 10, stiffness: 250 }}
                className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0 border-[var(--border-width)] border-[var(--card-border)] shadow-[3px_3px_0px_var(--card-border)]"
                style={{ backgroundColor: color, color: '#1A1A2E' }}
            >
                <Icon size={22} />
            </motion.div>

            <div className="flex-1 min-w-0">
                <p className="text-[10px] font-black uppercase tracking-widest text-[var(--muted)] mb-0.5">{title}</p>
                <AnimatedCounter
                    value={value}
                    prefix={prefix}
                    suffix={suffix}
                    decimals={decimals}
                    className="text-xl font-black nums text-[var(--foreground)]"
                />
            </div>

            {trend !== undefined && (
                <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className={`flex items-center gap-1 text-[11px] font-black px-2 py-1 rounded-md border-[var(--border-width)] border-[var(--card-border)] shrink-0 ${
                        isPositive
                            ? 'bg-[var(--success)] text-[#1A1A2E]'
                            : 'bg-[var(--danger)] text-white'
                    }`}
                >
                    {isPositive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                    {isPositive ? '+' : ''}{trend}%
                </motion.div>
            )}
        </motion.div>
    );
}
