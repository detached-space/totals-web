import { motion } from "framer-motion";
import { Send } from "lucide-react";
import Avatar from "../shared/Avatar";
import type { Person } from "../../lib/types";

interface PersonCardProps {
    person: Person;
}

export default function PersonCard({ person }: PersonCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2 }}
            className="glass-panel p-5 group cursor-pointer relative overflow-hidden"
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
                    <h4 className="font-semibold text-[var(--foreground)] truncate">{person.name}</h4>
                    <p className="text-sm font-mono text-[var(--muted)]">{person.amount}</p>
                    {person.lastTransaction && (
                        <p className="text-xs text-[var(--muted)] mt-1 truncate">
                            {person.lastTransaction} · {person.date}
                        </p>
                    )}
                </div>

                {/* Send button - appears on hover */}
                <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ scale: 1.05 }}
                    className="w-9 h-9 rounded-xl bg-[var(--accent)]/15 text-[var(--accent)] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                    <Send size={16} />
                </motion.button>
            </div>
        </motion.div>
    );
}
