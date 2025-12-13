import { useLocation } from "react-router-dom";

export default function Topbar() {
    const { pathname } = useLocation();

    // Convert pathname to title (e.g., "/transactions" -> "Transactions")
    const title = pathname === "/" ? "Overview" : pathname.split("/")[1].charAt(0).toUpperCase() + pathname.split("/")[1].slice(1);

    return (
        <header className="flex justify-between items-end pb-6 border-b border-[var(--color-card-border)] mb-8">
            <div>
                <h1 className="text-2xl font-bold text-[var(--color-foreground)] tracking-tight transition-colors duration-300">{title}</h1>
                <p className="text-[var(--color-foreground)] opacity-40 text-sm transition-colors duration-300">Welcome back, Brook</p>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-4">
                {/* Search - Keeping it minimal/hidden for now or could be a small icon */}
            </div>
        </header>
    );
}