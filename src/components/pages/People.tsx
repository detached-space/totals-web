import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import GlassCard from "../shared/GlassCard";
import PersonCard from "../cards/PersonCard";
import Avatar from "../shared/Avatar";
import Tabs from "../shared/Tabs";
import SearchFilter from "../widgets/SearchFilter";
import { topPeople, allPeople } from "../../lib/data";
import { bentoItemVariants } from "../layout/BentoGrid";
import { usePrivacy } from "../shared/PrivacyProvider";

const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.06 } },
};

const tabs = [
    { label: 'All', value: 'all' },
    { label: 'Frequent', value: 'frequent' },
    { label: 'Recent', value: 'recent' },
];

export default function People() {
    const { hidden } = usePrivacy();
    const [search, setSearch] = useState('');
    const [activeTab, setActiveTab] = useState('all');

    const filteredPeople = useMemo(() => {
        let list = allPeople;
        if (activeTab === 'frequent') list = allPeople.slice(0, 6);
        if (activeTab === 'recent') list = allPeople.filter(p => p.date).slice(0, 8);

        if (search) {
            list = list.filter(p =>
                p.name.toLowerCase().includes(search.toLowerCase())
            );
        }
        return list;
    }, [search, activeTab]);

    return (
        <div className="px-8 pb-8 max-w-[1600px] mx-auto">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-col gap-5"
            >
                {/* Top 3 Podium */}
                <motion.div variants={bentoItemVariants}>
                    <GlassCard padding="lg" hoverLift={false}>
                        <h3 className="text-body-title text-[var(--muted)] text-center mb-6">Top Interactions</h3>

                        <div className="flex items-end justify-center gap-6 md:gap-10 pb-4">
                            {/* 2nd Place */}
                            <div className="flex flex-col items-center gap-2">
                                <Avatar
                                    initials={topPeople[1].initials}
                                    size="lg"
                                    ring
                                    ringColor={topPeople[1].color}
                                    bg={topPeople[1].bg}
                                />
                                <div className="text-center">
                                    <p className="text-body-title">{topPeople[1].name}</p>
                                    <p className="text-xs text-[var(--muted)] font-mono nums">{hidden ? '••••' : topPeople[1].amount}</p>
                                </div>
                                <div className="w-16 h-20 bg-[var(--foreground)]/3 rounded-t-xl border-t border-x border-[var(--card-border)] flex items-start justify-center pt-2">
                                    <span className="text-xs font-bold text-[var(--muted)]">2</span>
                                </div>
                            </div>

                            {/* 1st Place */}
                            <div className="flex flex-col items-center gap-2 -translate-y-4">
                                <div className="relative">
                                    <Avatar
                                        initials={topPeople[0].initials}
                                        size="xl"
                                        ring
                                        ringColor="ring-yellow-400"
                                        bg={topPeople[0].bg}
                                    />
                                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-yellow-400 text-black text-xs font-bold px-3 py-0.5 rounded-full shadow-lg">
                                        1
                                    </div>
                                </div>
                                <div className="text-center mt-2">
                                    <p className="text-subsection-title">{topPeople[0].name}</p>
                                    <p className="text-xs text-[var(--muted)] font-mono nums">{hidden ? '••••' : topPeople[0].amount}</p>
                                </div>
                                <div className="w-20 h-28 bg-gradient-to-b from-yellow-400/10 to-[var(--card)] rounded-t-xl border-t border-x border-yellow-400/20 flex items-start justify-center pt-2">
                                    <span className="text-xs font-bold text-yellow-400">1</span>
                                </div>
                            </div>

                            {/* 3rd Place */}
                            <div className="flex flex-col items-center gap-2">
                                <Avatar
                                    initials={topPeople[2].initials}
                                    size="lg"
                                    ring
                                    ringColor={topPeople[2].color}
                                    bg={topPeople[2].bg}
                                />
                                <div className="text-center">
                                    <p className="text-body-title">{topPeople[2].name}</p>
                                    <p className="text-xs text-[var(--muted)] font-mono nums">{hidden ? '••••' : topPeople[2].amount}</p>
                                </div>
                                <div className="w-16 h-14 bg-[var(--foreground)]/3 rounded-t-xl border-t border-x border-[var(--card-border)] flex items-start justify-center pt-2">
                                    <span className="text-xs font-bold text-[var(--muted)]">3</span>
                                </div>
                            </div>
                        </div>
                    </GlassCard>
                </motion.div>

                {/* Tabs + Search */}
                <motion.div variants={bentoItemVariants} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} layoutId="people-tabs" />
                    <SearchFilter
                        placeholder="Search contacts..."
                        value={search}
                        onChange={setSearch}
                    />
                </motion.div>

                {/* People Grid */}
                <motion.div
                    variants={bentoItemVariants}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                    {filteredPeople.map((person) => (
                        <PersonCard key={person.rank} person={person} />
                    ))}
                </motion.div>

                {filteredPeople.length === 0 && (
                    <motion.div variants={bentoItemVariants}>
                        <p className="text-body text-[var(--muted)] text-center py-12">No contacts found</p>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}
