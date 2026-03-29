import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownLeft, RefreshCw, Trophy } from "lucide-react";
import type { ActivityItem as ActivityItemType } from "../../lib/types";
import { getRelativeTime } from "../../lib/helpers";
import { usePrivacy } from "../shared/PrivacyProvider";

interface ActivityItemProps {
    activity: ActivityItemType;
    isLast?: boolean;
}

const typeConfig = {
    transaction: { icon: ArrowUpRight, bg: 'bg-[var(--pop-blue)]' },
    account: { icon: RefreshCw, bg: 'bg-[var(--pop-purple)]' },
    milestone: { icon: Trophy, bg: 'bg-[var(--pop-yellow)]' },
};

export default function ActivityItemComponent({ activity, isLast = false }: ActivityItemProps) {
    const { hidden } = usePrivacy();
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
            <div className="flex flex-col items-center">
                <div className={`w-9 h-9 rounded-lg ${config.bg} flex items-center justify-center shrink-0 border-[var(--border-width)] border-[var(--card-border)] text-[#1A1A2E]`}>
                    <Icon size={16} />
                </div>
                {!isLast && <div className="w-0.5 flex-1 bg-[var(--card-border)] mt-2" />}
            </div>

            <div className="pb-6 flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="text-body-title text-[var(--foreground)]">{activity.title}</p>
                        <p className="text-caption mt-0.5">{activity.description}</p>
                    </div>
                    <div className="text-right shrink-0">
                        {activity.amount && (
                            <p className={`text-sm font-black nums ${activity.amount > 0 ? 'text-[var(--success)]' : 'text-[var(--foreground)]'}`}>
                                {hidden ? '----' : `${activity.amount > 0 ? '+' : '-'}$${Math.abs(activity.amount).toLocaleString()}`}
                            </p>
                        )}
                        <p className="text-caption">{getRelativeTime(activity.timestamp)}</p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
