import { Search, X } from "lucide-react";

interface SearchFilterProps {
    placeholder?: string;
    value: string;
    onChange: (value: string) => void;
    filters?: { label: string; value: string; active: boolean; onClick: () => void }[];
    className?: string;
}

export default function SearchFilter({ placeholder = "Search...", value, onChange, filters, className = '' }: SearchFilterProps) {
    return (
        <div className={`flex flex-col sm:flex-row items-start sm:items-center gap-3 ${className}`}>
            <div className="relative flex-1 w-full sm:max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" size={16} />
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="w-full bg-[var(--card)] border-[var(--border-width)] border-[var(--card-border)] rounded-lg pl-10 pr-10 py-2.5 text-sm text-[var(--foreground)] outline-none focus:shadow-[var(--shadow-brutal-accent)] transition-shadow placeholder:text-[var(--muted)] shadow-[var(--shadow-brutal)]"
                />
                {value && (
                    <button
                        onClick={() => onChange('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--foreground)] cursor-pointer"
                    >
                        <X size={14} />
                    </button>
                )}
            </div>

            {filters && filters.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                    {filters.map((filter) => (
                        <button
                            key={filter.value}
                            onClick={filter.onClick}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border-[var(--border-width)] border-[var(--card-border)] ${
                                filter.active
                                    ? 'bg-[var(--accent)] text-white shadow-[3px_3px_0px_var(--card-border)]'
                                    : 'bg-[var(--card)] text-[var(--muted)] hover:text-[var(--foreground)] shadow-[2px_2px_0px_var(--card-border)]'
                            }`}
                        >
                            {filter.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
