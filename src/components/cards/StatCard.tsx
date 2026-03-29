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
            whileHover={{ y: -4, transition: { type: 'spring', damping: 20, stiffness: 300 } }}
            whileTap={{ scale: 0.97, transition: { type: 'spring', damping: 15, stiffness: 400 } }}
            className={`glass-panel p-6 flex flex-col gap-4 group cursor-pointer ${className}`}
            style={{ '--stat-color': color } as React.CSSProperties}
        >
            <div className="flex items-center justify-between">
                <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center transition-shadow duration-500 group-hover:shadow-[0_0_30px_-5px_var(--stat-color)]"
                    style={{ backgroundColor: `${color}15`, color }}
                >
                    <Icon size={20} />
                </div>

                {trend !== undefined && (
                    <div className={`flex items-center gap-1 text-xs font-medium ${
                        isPositive ? 'text-[var(--success)]' : 'text-[var(--danger)]'
                    }`}>
                        {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        {isPositive ? '+' : ''}{trend}%
                    </div>
                )}
            </div>

            <div>
                <p className="text-label-light mb-1.5">{title}</p>
                <AnimatedCounter
                    value={value}
                    prefix={prefix}
                    suffix={suffix}
                    decimals={decimals}
                    className="text-section-title nums text-[var(--foreground)]"
                />
            </div>
        </motion.div>
    );
}
