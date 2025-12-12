import { Home, Wallet2, PieChart, Settings } from "lucide-react";

export default function Sidebar() {
    const nav = [
        { icon: <Home size={20} />, label: "Dashboard" },
        { icon: <Wallet2 size={20} />, label: "Accounts" },
        { icon: <PieChart size={20} />, label: "Analytics" },
        { icon: <Settings size={20} />, label: "Settings" },
    ];

    return (
        <aside className="w-64 h-screen border-r p-6 flex flex-col gap-6 bg-[var(--color-bg)] text-[var(--color-text)]">
            <h1 className="text-2xl font-semibold tracking-tight">totals.</h1>
            <nav className="flex flex-col gap-3">
                {nav.map((n) => (
                    <button
                        key={n.label}
                        className="flex items-center gap-3 px-3 py-2 rounded-[var(--radius-ui)] hover:bg-black/5 dark:hover:bg-white/10 transition"
                    >
                        {n.icon}
                        <span>{n.label}</span>
                    </button>
                ))}
            </nav>
        </aside>
    );
}