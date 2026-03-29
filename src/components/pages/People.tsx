import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import GlassCard from "../shared/GlassCard";
import PersonCard from "../cards/PersonCard";
import Avatar from "../shared/Avatar";
import Tabs from "../shared/Tabs";
import SearchFilter from "../widgets/SearchFilter";
import AnimatedCounter from "../shared/AnimatedCounter";
import { topPeople, allPeople } from "../../lib/data";
import { bentoItemVariants } from "../layout/BentoGrid";
import { usePrivacy } from "../shared/PrivacyProvider";
import { Users, Send, Trophy, TrendingUp } from "lucide-react";

const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
};

const podiumVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.85 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            delay: 0.2 + i * 0.15,
            type: 'spring' as const,
            damping: 10,
            stiffness: 180,
        },
    }),
};

const barGrowVariants = {
    hidden: { scaleY: 0 },
    visible: (i: number) => ({
        scaleY: 1,
        transition: {
            delay: 0.5 + i * 0.15,
            type: 'spring' as const,
            damping: 12,
            stiffness: 200,
        },
    }),
};

const cardStagger = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            delay: i * 0.06,
            type: 'spring' as const,
            damping: 18,
            stiffness: 280,
        },
    }),
};

const tabs = [
    { label: 'All', value: 'all' },
    { label: 'Frequent', value: 'frequent' },
    { label: 'Recent', value: 'recent' },
];

const podiumColors = ['var(--pop-yellow)', 'var(--pop-blue)', 'var(--pop-pink)'];
const podiumOrder = [1, 0, 2]; // 2nd, 1st, 3rd

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

    const totalVolume = 15240 + 8500 + 6200 + 5100 + 4700 + 3200 + 2800 + 1900;

    return (
        <div className="px-8 pb-8 max-w-[1600px] mx-auto">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-col gap-5"
            >
                {/* Hero Stats Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <motion.div
                        variants={bentoItemVariants}
                        whileHover={{ x: -3, y: -3, boxShadow: '6px 6px 0px var(--card-border)', transition: { duration: 0.1 } }}
                        whileTap={{ x: 2, y: 2, boxShadow: '0px 0px 0px var(--card-border)', transition: { duration: 0.05 } }}
                        className="glass-panel p-5 flex items-center gap-4 cursor-pointer"
                    >
                        <motion.div
                            initial={{ scale: 0, rotate: -45 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: 0.2, type: 'spring' as const, damping: 10, stiffness: 250 }}
                            className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0 border-[var(--border-width)] border-[var(--card-border)] shadow-[3px_3px_0px_var(--card-border)] bg-[var(--pop-blue)]"
                        >
                            <Users size={22} className="text-[#1A1A2E]" />
                        </motion.div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--muted)] mb-0.5">Contacts</p>
                            <AnimatedCounter value={allPeople.length} prefix="" decimals={0} className="text-xl font-black nums text-[var(--foreground)]" />
                        </div>
                    </motion.div>

                    <motion.div
                        variants={bentoItemVariants}
                        whileHover={{ x: -3, y: -3, boxShadow: '6px 6px 0px var(--card-border)', transition: { duration: 0.1 } }}
                        whileTap={{ x: 2, y: 2, boxShadow: '0px 0px 0px var(--card-border)', transition: { duration: 0.05 } }}
                        className="glass-panel p-5 flex items-center gap-4 cursor-pointer"
                    >
                        <motion.div
                            initial={{ scale: 0, rotate: -45 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: 0.3, type: 'spring' as const, damping: 10, stiffness: 250 }}
                            className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0 border-[var(--border-width)] border-[var(--card-border)] shadow-[3px_3px_0px_var(--card-border)] bg-[var(--pop-green)]"
                        >
                            <TrendingUp size={22} className="text-[#1A1A2E]" />
                        </motion.div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--muted)] mb-0.5">Total Volume</p>
                            <AnimatedCounter value={totalVolume} prefix="$" decimals={0} className="text-xl font-black nums text-[var(--foreground)]" />
                        </div>
                    </motion.div>

                    <motion.div
                        variants={bentoItemVariants}
                        whileHover={{ x: -3, y: -3, boxShadow: '6px 6px 0px var(--card-border)', transition: { duration: 0.1 } }}
                        whileTap={{ x: 2, y: 2, boxShadow: '0px 0px 0px var(--card-border)', transition: { duration: 0.05 } }}
                        className="glass-panel p-5 flex items-center gap-4 cursor-pointer"
                    >
                        <motion.div
                            initial={{ scale: 0, rotate: -45 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: 0.4, type: 'spring' as const, damping: 10, stiffness: 250 }}
                            className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0 border-[var(--border-width)] border-[var(--card-border)] shadow-[3px_3px_0px_var(--card-border)] bg-[var(--pop-purple)]"
                        >
                            <Send size={22} className="text-white" />
                        </motion.div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--muted)] mb-0.5">Last Sent</p>
                            <p className="text-xl font-black text-[var(--foreground)]">2 days ago</p>
                        </div>
                    </motion.div>
                </div>

                {/* Top 3 Podium — Redesigned */}
                <motion.div variants={bentoItemVariants}>
                    <GlassCard padding="lg" hoverLift={false}>
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <Trophy size={18} className="text-[var(--pop-yellow)]" />
                                <h3 className="text-subsection-title text-[var(--foreground)]">Top Interactions</h3>
                            </div>
                            <span className="brutal-tag bg-[var(--pop-yellow)] text-[#1A1A2E]">This Month</span>
                        </div>

                        <div className="flex items-end justify-center gap-4 md:gap-8 pb-2">
                            {podiumOrder.map((idx, pos) => {
                                const person = topPeople[idx];
                                const isFirst = idx === 0;
                                const heights = [80, 112, 56];
                                const barHeight = heights[idx];

                                return (
                                    <motion.div
                                        key={person.rank}
                                        custom={pos}
                                        variants={podiumVariants}
                                        initial="hidden"
                                        animate="visible"
                                        className="flex flex-col items-center gap-2"
                                    >
                                        {/* Avatar with bounce */}
                                        <motion.div
                                            initial={{ scale: 0, rotate: -20 }}
                                            animate={{ scale: 1, rotate: 0 }}
                                            transition={{ delay: 0.4 + pos * 0.15, type: 'spring' as const, damping: 8, stiffness: 200 }}
                                            className="relative"
                                        >
                                            <Avatar
                                                initials={person.initials}
                                                size={isFirst ? "xl" : "lg"}
                                                ring
                                                ringColor={person.color}
                                                bg={person.bg}
                                            />
                                            {isFirst && (
                                                <motion.span
                                                    initial={{ scale: 0, y: 10 }}
                                                    animate={{ scale: 1, y: 0 }}
                                                    transition={{ delay: 0.8, type: 'spring' as const, damping: 8, stiffness: 300 }}
                                                    className="absolute -top-3 -right-2 text-lg"
                                                >
                                                    👑
                                                </motion.span>
                                            )}
                                        </motion.div>

                                        <div className="text-center">
                                            <p className={`font-black text-[var(--foreground)] ${isFirst ? 'text-base' : 'text-sm'}`}>{person.name}</p>
                                            <p className="text-[11px] font-bold text-[var(--muted)] nums">{hidden ? '••••' : person.amount}</p>
                                        </div>

                                        {/* Podium bar */}
                                        <motion.div
                                            custom={pos}
                                            variants={barGrowVariants}
                                            initial="hidden"
                                            animate="visible"
                                            className="w-20 rounded-t-lg border-t-[var(--border-width)] border-x-[var(--border-width)] border-[var(--card-border)] flex items-start justify-center pt-3"
                                            style={{
                                                height: barHeight,
                                                backgroundColor: podiumColors[idx],
                                                originY: 1,
                                            }}
                                        >
                                            <span className="text-sm font-black text-[#1A1A2E]">#{idx + 1}</span>
                                        </motion.div>
                                    </motion.div>
                                );
                            })}
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

                {/* People Grid — staggered card entrance */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredPeople.map((person, i) => (
                        <motion.div
                            key={person.rank}
                            custom={i}
                            variants={cardStagger}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                        >
                            <PersonCard person={person} />
                        </motion.div>
                    ))}
                </div>

                {filteredPeople.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <p className="text-body text-[var(--muted)] text-center py-12">No contacts found</p>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}
