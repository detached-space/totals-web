import { motion } from "framer-motion";
import { Send, ArrowDownLeft, Receipt, Plus } from "lucide-react";
import { bentoItemVariants } from "../layout/BentoGrid";

const actions = [
    { icon: Send, label: "Send", color: "var(--pop-blue)" },
    { icon: ArrowDownLeft, label: "Request", color: "var(--pop-green)" },
    { icon: Receipt, label: "Pay Bills", color: "var(--pop-yellow)" },
    { icon: Plus, label: "Top Up", color: "var(--pop-purple)" },
];

export default function QuickActions({ className = '' }: { className?: string }) {
    return (
        <motion.div
            variants={bentoItemVariants}
            className={`glass-panel p-5 ${className}`}
        >
            <p className="text-label-light mb-4">Quick Actions</p>
            <div className="grid grid-cols-2 gap-3">
                {actions.map((action) => (
                    <motion.button
                        key={action.label}
                        whileHover={{ x: -2, y: -2, transition: { duration: 0.1 } }}
                        whileTap={{ x: 1, y: 1, transition: { duration: 0.05 } }}
                        className="flex flex-col items-center gap-2 p-4 rounded-lg border-[var(--border-width)] border-[var(--card-border)] shadow-[3px_3px_0px_var(--card-border)] bg-[var(--card)] cursor-pointer transition-all"
                    >
                        <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center border-[var(--border-width)] border-[var(--card-border)]"
                            style={{ backgroundColor: action.color, color: '#1A1A2E' }}
                        >
                            <action.icon size={20} />
                        </div>
                        <span className="text-xs font-bold text-[var(--foreground)]">{action.label}</span>
                    </motion.button>
                ))}
            </div>
        </motion.div>
    );
}
