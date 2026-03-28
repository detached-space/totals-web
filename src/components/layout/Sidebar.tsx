import {
    Home, Wallet, CreditCard, Users, ChevronLeft, ChevronRight,
    BarChart3, Activity, PiggyBank, Sun, Moon
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../theme/ThemeProvider";
import Avatar from "../shared/Avatar";

const navGroups = [
    {
        label: "Main",
        items: [
            { icon: Home, label: "Dashboard", path: "/" },
            { icon: Wallet, label: "Accounts", path: "/accounts" },
            { icon: CreditCard, label: "Transactions", path: "/transactions" },
        ],
    },
    {
        label: "Social",
        items: [
            { icon: Users, label: "People", path: "/people" },
        ],
    },
    {
        label: "Insights",
        items: [
            { icon: BarChart3, label: "Analytics", path: "/analytics" },
            { icon: Activity, label: "Activity", path: "/activity", badge: 3 },
            { icon: PiggyBank, label: "Budget", path: "/budget" },
        ],
    },
];

export default function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const location = useLocation();
    const { theme, setTheme } = useTheme();

    function isActive(path: string) {
        if (path === "/" && location.pathname === "/") return true;
        if (path !== "/" && location.pathname.startsWith(path)) return true;
        return false;
    }

    return (
        <motion.aside
            animate={{ width: collapsed ? 76 : 260 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
            className="h-screen flex flex-col relative z-50 shrink-0"
        >
            {/* Glass Background */}
            <div className="absolute inset-0 bg-[var(--glass-bg-lg)] backdrop-blur-2xl border-r border-[var(--card-border)]" />

            <div className="relative z-10 flex flex-col h-full">
                {/* Profile Section */}
                <div className="p-4 flex items-center gap-3 border-b border-[var(--card-border)]">
                    <Avatar initials="BS" size="md" bg="bg-gradient-to-br from-blue-500 to-purple-600 text-white" />
                    <AnimatePresence>
                        {!collapsed && (
                            <motion.div
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: 'auto' }}
                                exit={{ opacity: 0, width: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                            >
                                <p className="font-semibold text-sm text-[var(--foreground)] whitespace-nowrap">Brook Solomon</p>
                                <p className="text-xs text-[var(--muted)] whitespace-nowrap">Personal</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto custom-scrollbar">
                    {navGroups.map((group) => (
                        <div key={group.label} className="mb-2">
                            <AnimatePresence>
                                {!collapsed && (
                                    <motion.span
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="text-overline px-3 mb-2 block"
                                    >
                                        {group.label}
                                    </motion.span>
                                )}
                            </AnimatePresence>

                            {group.items.map((item) => {
                                const active = isActive(item.path);
                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors group ${
                                            active
                                                ? 'text-[var(--foreground)]'
                                                : 'text-[var(--muted)] hover:text-[var(--foreground)]'
                                        } ${collapsed ? 'justify-center' : ''}`}
                                    >
                                        {active && (
                                            <motion.div
                                                layoutId="sidebar-active"
                                                className="absolute inset-0 rounded-xl bg-[var(--accent)]/10 border border-[var(--accent)]/20"
                                                transition={{ type: 'spring', duration: 0.4, bounce: 0.15 }}
                                            />
                                        )}

                                        <span className="relative z-10 flex items-center justify-center w-5 h-5">
                                            <item.icon size={20} className={active ? 'text-[var(--accent)]' : ''} />
                                        </span>

                                        <AnimatePresence>
                                            {!collapsed && (
                                                <motion.span
                                                    initial={{ opacity: 0, x: -8 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: -8 }}
                                                    transition={{ duration: 0.15 }}
                                                    className="relative z-10 text-sm font-medium whitespace-nowrap"
                                                >
                                                    {item.label}
                                                </motion.span>
                                            )}
                                        </AnimatePresence>

                                        {/* Badge */}
                                        {'badge' in item && item.badge && (
                                            <AnimatePresence>
                                                {!collapsed ? (
                                                    <motion.span
                                                        initial={{ opacity: 0, scale: 0 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        exit={{ opacity: 0, scale: 0 }}
                                                        className="relative z-10 ml-auto bg-[var(--accent)] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center"
                                                    >
                                                        {item.badge}
                                                    </motion.span>
                                                ) : (
                                                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[var(--accent)] rounded-full" />
                                                )}
                                            </AnimatePresence>
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    ))}
                </nav>

                {/* Bottom Actions */}
                <div className="p-3 border-t border-[var(--card-border)] flex flex-col gap-1">
                    <button
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[var(--muted)] hover:text-[var(--foreground)] transition-colors cursor-pointer ${collapsed ? 'justify-center' : ''}`}
                    >
                        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        <AnimatePresence>
                            {!collapsed && (
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="text-sm font-medium"
                                >
                                    {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </button>

                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--foreground)]/5 transition-colors cursor-pointer ${collapsed ? 'justify-center' : ''}`}
                    >
                        {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                        <AnimatePresence>
                            {!collapsed && (
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="text-sm font-medium"
                                >
                                    Collapse
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </button>
                </div>
            </div>
        </motion.aside>
    );
}
