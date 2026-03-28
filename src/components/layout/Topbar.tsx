import { useLocation } from "react-router-dom";
import { Bell, Search } from "lucide-react";
import Avatar from "../shared/Avatar";

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
    const page = pageTitles[pathname] || { title: 'Overview', subtitle: '' };

    return (
        <header className="sticky top-0 z-40 px-8 py-5">
            <div className="flex justify-between items-center">
                {/* Left: Title */}
                <div>
                    <h1 className="text-h2 text-[var(--foreground)]">{page.title}</h1>
                    <p className="text-sm text-[var(--muted)] mt-0.5">{page.subtitle}</p>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-3">
                    {/* Search */}
                    <button className="w-10 h-10 rounded-xl bg-[var(--foreground)]/5 border border-[var(--card-border)] flex items-center justify-center text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--foreground)]/10 transition-colors cursor-pointer">
                        <Search size={18} />
                    </button>

                    {/* Notifications */}
                    <button className="relative w-10 h-10 rounded-xl bg-[var(--foreground)]/5 border border-[var(--card-border)] flex items-center justify-center text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--foreground)]/10 transition-colors cursor-pointer">
                        <Bell size={18} />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-[var(--accent)] rounded-full" />
                    </button>

                    {/* Divider */}
                    <div className="w-px h-8 bg-[var(--card-border)] mx-1" />

                    {/* User */}
                    <Avatar initials="BS" size="sm" bg="bg-gradient-to-br from-blue-500 to-purple-600 text-white" />
                </div>
            </div>
        </header>
    );
}
