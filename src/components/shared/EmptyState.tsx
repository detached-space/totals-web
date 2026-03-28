import { Inbox } from "lucide-react";

interface EmptyStateProps {
    icon?: React.ReactNode;
    title?: string;
    message?: string;
}

export default function EmptyState({
    icon = <Inbox size={40} />,
    title = "Nothing here",
    message = "No data to display yet."
}: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-[var(--muted)]">
            <div className="mb-4 opacity-40">{icon}</div>
            <h3 className="text-lg font-semibold mb-1 text-[var(--foreground)]/60">{title}</h3>
            <p className="text-sm">{message}</p>
        </div>
    );
}
