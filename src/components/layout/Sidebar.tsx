import { Home, Wallet, CreditCard, Users, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const location = useLocation();

    const nav = [
        { icon: Home, label: "Dashboard", path: "/" },
        { icon: Wallet, label: "Accounts", path: "/accounts" },
        { icon: CreditCard, label: "Transactions", path: "/transactions" },
        { icon: Users, label: "People", path: "/people" },
    ];

    function isActive(path: string) {
        if (path === "/" && location.pathname === "/") return true;
        if (path !== "/" && location.pathname.startsWith(path)) return true;
        return false;
    }

    return (
        <motion.aside
            animate={{ width: collapsed ? "80px" : "280px" }}
            className="h-screen border-r border-[var(--color-card-border)] flex flex-col bg-[var(--color-card)] backdrop-blur-xl relative z-50 pointer-events-auto transition-colors duration-300"
        >
            <div className="p-6 flex items-center justify-between">
                <AnimatePresence>
                    {!collapsed && (
                        <motion.h1
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-2xl font-bold tracking-tight text-[var(--color-foreground)]"
                        >
                            totals.
                        </motion.h1>
                    )}
                </AnimatePresence>
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="p-2 rounded-lg text-[var(--color-foreground)] opacity-50 hover:bg-[var(--color-foreground)]/5 hover:opacity-100 transition-all cursor-pointer"
                >
                    {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                </button>
            </div>

            <nav className="flex-1 px-4 flex flex-col gap-2 mt-4">
                {nav.map((n) => {
                    const active = isActive(n.path);
                    return (
                        <Link
                            key={n.label}
                            to={n.path}
                            className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all group ${active ? 'bg-blue-600/20 text-blue-400' : 'text-[var(--color-foreground)] opacity-60 hover:bg-[var(--color-foreground)]/5 hover:opacity-100 hover:text-[var(--color-foreground)]'}`}
                        >
                            <n.icon size={20} className={active ? "text-blue-400" : "group-hover:text-[var(--color-foreground)] transition-colors"} />
                            {!collapsed && (
                                <motion.span
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="font-medium"
                                >
                                    {n.label}
                                </motion.span>
                            )}
                        </Link>
                    );
                })}
            </nav>
        </motion.aside>
    );
}