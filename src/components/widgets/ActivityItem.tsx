import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownLeft, RefreshCw, Trophy } from "lucide-react";
import type { ActivityItem as ActivityItemType } from "../../lib/types";
import { getRelativeTime } from "../../lib/helpers";

interface ActivityItemProps {
    activity: ActivityItemType;
    isLast?: boolean;
}

const typeConfig = {
    transaction: { icon: ArrowUpRight, color: 'text-blue-400', bg: 'bg-blue-500/15' },
    account: { icon: RefreshCw, color: 'text-purple-400', bg: 'bg-purple-500/15' },
    milestone: { icon: Trophy, color: 'text-amber-400', bg: 'bg-amber-500/15' },
};

export default function ActivityItemComponent({ activity, isLast = false }: ActivityItemProps) {
    const config = typeConfig[activity.type];
    const Icon = activity.type === 'transaction' && activity.amount && activity.amount > 0
        ? ArrowDownLeft
        : config.icon;

    return (
        <motion.div
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            className="flex gap-4"
        >
            {/* Timeline line + dot */}
            <div className="flex flex-col items-center">
                <div className={`w-9 h-9 rounded-xl ${config.bg} flex items-center justify-center shrink-0`}>
                    <Icon size={16} className={config.color} />
                </div>
                {!isLast && <div className="w-px flex-1 bg-[var(--card-border)] mt-2" />}
            </div>

            {/* Content */}
            <div className="pb-6 flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="text-sm font-medium text-[var(--foreground)]">{activity.title}</p>
                        <p className="text-xs text-[var(--muted)] mt-0.5">{activity.description}</p>
                    </div>
                    <div className="text-right shrink-0">
                        {activity.amount && (
                            <p className={`text-sm font-semibold ${activity.amount > 0 ? 'text-emerald-400' : 'text-[var(--foreground)]'}`}>
                                {activity.amount > 0 ? '+' : '-'}${Math.abs(activity.amount).toLocaleString()}
                            </p>
                        )}
                        <p className="text-[11px] text-[var(--muted)]">{getRelativeTime(activity.timestamp)}</p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
