import { motion } from "framer-motion";
import { Send, ArrowDownLeft, Receipt, Plus } from "lucide-react";
import { bentoItemVariants } from "../layout/BentoGrid";

const actions = [
    { icon: Send, label: "Send", color: "#3b82f6" },
    { icon: ArrowDownLeft, label: "Request", color: "#22c55e" },
    { icon: Receipt, label: "Pay Bills", color: "#f59e0b" },
    { icon: Plus, label: "Top Up", color: "#a78bfa" },
];

export default function QuickActions({ className = '' }: { className?: string }) {
    return (
        <motion.div
            variants={bentoItemVariants}
            className={`glass-panel p-5 ${className}`}
        >
            <p className="text-xs text-[var(--muted)] font-medium mb-4">Quick Actions</p>
            <div className="grid grid-cols-2 gap-3">
                {actions.map((action) => (
                    <motion.button
                        key={action.label}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[var(--foreground)]/3 hover:bg-[var(--foreground)]/6 border border-[var(--card-border)] transition-colors cursor-pointer"
                    >
                        <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center"
                            style={{ backgroundColor: `${action.color}15`, color: action.color }}
                        >
                            <action.icon size={20} />
                        </div>
                        <span className="text-xs font-medium text-[var(--foreground)]">{action.label}</span>
                    </motion.button>
                ))}
            </div>
        </motion.div>
    );
}
