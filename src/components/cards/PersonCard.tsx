import { motion } from "framer-motion";
import { Send } from "lucide-react";
import Avatar from "../shared/Avatar";
import { usePrivacy } from "../shared/PrivacyProvider";
import type { Person } from "../../lib/types";

interface PersonCardProps {
    person: Person;
}

export default function PersonCard({ person }: PersonCardProps) {
    const { hidden } = usePrivacy();
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ x: -2, y: -2, transition: { duration: 0.1 } }}
            whileTap={{ x: 2, y: 2, transition: { duration: 0.05 } }}
            className="glass-panel p-5 cursor-pointer relative overflow-hidden group"
        >
            <div className="flex items-center gap-4">
                <Avatar
                    initials={person.initials}
                    size="lg"
                    bg={person.bg}
                    ring={person.rank <= 3}
                    ringColor={person.color}
                />
                <div className="flex-1 min-w-0">
                    <h4 className="text-body-lg text-[var(--foreground)] truncate">{person.name}</h4>
                    <p className="text-body font-mono text-[var(--muted)] font-bold">{hidden ? '----' : person.amount}</p>
                    {person.lastTransaction && (
                        <p className="text-caption mt-1 truncate">
                            {person.lastTransaction} · {person.date}
                        </p>
                    )}
                </div>

                <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ scale: 1.05 }}
                    className="w-9 h-9 rounded-lg bg-[var(--accent)] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer border-[var(--border-width)] border-[var(--card-border)] shadow-[2px_2px_0px_var(--card-border)]"
                >
                    <Send size={16} />
                </motion.button>
            </div>
        </motion.div>
    );
}
