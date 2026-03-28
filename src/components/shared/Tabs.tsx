import { motion } from "framer-motion";

interface Tab {
    label: string;
    value: string;
}

interface TabsProps {
    tabs: Tab[];
    active: string;
    onChange: (value: string) => void;
    className?: string;
    layoutId?: string;
}

export default function Tabs({ tabs, active, onChange, className = '', layoutId = 'tab-pill' }: TabsProps) {
    return (
        <div className={`inline-flex items-center gap-1 p-1 rounded-xl bg-[var(--foreground)]/5 ${className}`}>
            {tabs.map((tab) => (
                <button
                    key={tab.value}
                    onClick={() => onChange(tab.value)}
                    className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                        active === tab.value
                            ? 'text-[var(--foreground)]'
                            : 'text-[var(--muted)] hover:text-[var(--foreground)]'
                    }`}
                >
                    {active === tab.value && (
                        <motion.div
                            layoutId={layoutId}
                            className="absolute inset-0 rounded-lg bg-[var(--foreground)]/10 border border-[var(--card-border)]"
                            transition={{ type: 'spring', duration: 0.4, bounce: 0.15 }}
                        />
                    )}
                    <span className="relative z-10">{tab.label}</span>
                </button>
            ))}
        </div>
    );
}
