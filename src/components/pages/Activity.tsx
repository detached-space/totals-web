import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Tabs from "../shared/Tabs";
import ActivityItemComponent from "../widgets/ActivityItem";
import { activityFeed } from "../../lib/data";
import { getDateGroup } from "../../lib/helpers";
import { bentoItemVariants } from "../layout/BentoGrid";

const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.04 } },
};

const tabs = [
    { label: 'All', value: 'all' },
    { label: 'Transactions', value: 'transaction' },
    { label: 'Account', value: 'account' },
    { label: 'Milestones', value: 'milestone' },
];

export default function ActivityPage() {
    const [activeTab, setActiveTab] = useState('all');

    const filtered = useMemo(() => {
        if (activeTab === 'all') return activityFeed;
        return activityFeed.filter(a => a.type === activeTab);
    }, [activeTab]);

    // Group by date
    const grouped = useMemo(() => {
        const groups: Record<string, typeof activityFeed> = {};
        filtered.forEach(a => {
            const key = getDateGroup(a.timestamp);
            if (!groups[key]) groups[key] = [];
            groups[key].push(a);
        });
        return groups;
    }, [filtered]);

    return (
        <div className="px-8 pb-8 max-w-[1600px] mx-auto">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-col gap-5"
            >
                {/* Filter Tabs */}
                <motion.div variants={bentoItemVariants}>
                    <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} layoutId="activity-tabs" />
                </motion.div>

                {/* Activity Feed */}
                {Object.entries(grouped).map(([date, items]) => (
                    <motion.div key={date} variants={bentoItemVariants}>
                        {/* Sticky date header */}
                        <div className="sticky top-0 z-10 py-2 mb-3">
                            <span className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider bg-[var(--background)]/80 backdrop-blur-sm px-3 py-1 rounded-full">
                                {date}
                            </span>
                        </div>

                        <div className="ml-1">
                            {items.map((activity, i) => (
                                <ActivityItemComponent
                                    key={activity.id}
                                    activity={activity}
                                    isLast={i === items.length - 1}
                                />
                            ))}
                        </div>
                    </motion.div>
                ))}

                {filtered.length === 0 && (
                    <motion.div variants={bentoItemVariants}>
                        <p className="text-center text-sm text-[var(--muted)] py-16">No activity to show</p>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}
