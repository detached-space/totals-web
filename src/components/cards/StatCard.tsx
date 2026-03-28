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
            className={`glass-panel p-6 flex flex-col gap-4 ${className}`}
        >
            <div className="flex items-center justify-between">
                <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${color}15`, color }}
                >
                    <Icon size={20} />
                </div>

                {trend !== undefined && (
                    <div className={`flex items-center gap-1 text-xs font-medium ${
                        isPositive ? 'text-emerald-400' : 'text-red-400'
                    }`}>
                        {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        {isPositive ? '+' : ''}{trend}%
                    </div>
                )}
            </div>

            <div>
                <p className="text-xs text-[var(--muted)] mb-1">{title}</p>
                <AnimatedCounter
                    value={value}
                    prefix={prefix}
                    suffix={suffix}
                    decimals={decimals}
                    className="text-2xl font-bold text-[var(--foreground)]"
                />
            </div>
        </motion.div>
    );
}
