import { useLocation } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { usePrivacy } from "../shared/PrivacyProvider";
import { motion, AnimatePresence } from "framer-motion";

const pageTitles: Record<string, { title: string; subtitle: string }> = {
    '/': { title: 'Dashboard', subtitle: 'Welcome back, Brook' },
    '/accounts': { title: 'Accounts', subtitle: 'Manage your connected accounts' },
    '/transactions': { title: 'Transactions', subtitle: 'Track your money flow' },
    '/people': { title: 'People', subtitle: 'Your frequent contacts' },
    '/analytics': { title: 'Analytics', subtitle: 'Financial insights and trends' },
    '/activity': { title: 'Activity', subtitle: 'Recent account activity' },
    '/budget': { title: 'Budget', subtitle: 'Track spending against goals' },
};

export default function Topbar() {
    const { pathname } = useLocation();
    const { hidden, toggle } = usePrivacy();
    const page = pageTitles[pathname] || { title: 'Overview', subtitle: '' };

    return (
        <header className="sticky top-0 z-40 px-8 py-5">
            <div className="flex justify-between items-center">
                {/* Left: Title */}
                <div>
                    <h1 className="text-screen-title text-[var(--foreground)]">{page.title}</h1>
                    <p className="text-caption mt-0.5">{page.subtitle}</p>
                </div>

                {/* Right: Privacy Toggle */}
                <motion.button
                    onClick={toggle}
                    whileTap={{ scale: 0.9 }}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors cursor-pointer border ${
                        hidden
                            ? 'bg-[var(--accent)]/15 border-[var(--accent)]/25 text-[var(--accent)]'
                            : 'bg-[var(--foreground)]/5 border-[var(--card-border)] text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--foreground)]/10'
                    }`}
                    title={hidden ? 'Show amounts' : 'Hide amounts'}
                >
                    <AnimatePresence mode="wait" initial={false}>
                        {hidden ? (
                            <motion.div
                                key="off"
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.5, opacity: 0 }}
                                transition={{ duration: 0.15 }}
                            >
                                <EyeOff size={18} />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="on"
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.5, opacity: 0 }}
                                transition={{ duration: 0.15 }}
                            >
                                <Eye size={18} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.button>
            </div>
        </header>
    );
}
