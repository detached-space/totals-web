interface BadgeProps {
    variant: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
    children: React.ReactNode;
    size?: 'sm' | 'md';
    dot?: boolean;
    pulse?: boolean;
}

const variantStyles = {
    success: 'bg-[var(--success)] text-[#1A1A2E] border-[var(--card-border)]',
    warning: 'bg-[var(--warning)] text-[#1A1A2E] border-[var(--card-border)]',
    danger: 'bg-[var(--danger)] text-white border-[var(--card-border)]',
    info: 'bg-[var(--pop-blue)] text-[#1A1A2E] border-[var(--card-border)]',
    neutral: 'bg-[var(--muted-fill)] text-[var(--muted)] border-[var(--card-border)]',
};

const dotColors = {
    success: 'bg-[#1A1A2E]',
    warning: 'bg-[#1A1A2E]',
    danger: 'bg-white',
    info: 'bg-[#1A1A2E]',
    neutral: 'bg-[var(--muted)]',
};

export default function Badge({ variant, children, size = 'sm', dot = false, pulse = false }: BadgeProps) {
    return (
        <span className={`inline-flex items-center gap-1.5 border-[var(--border-width)] rounded-md font-black uppercase tracking-wider ${variantStyles[variant]} ${size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs'}`}>
            {dot && (
                <span className="relative flex h-1.5 w-1.5">
                    {pulse && <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${dotColors[variant]}`} />}
                    <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${dotColors[variant]}`} />
                </span>
            )}
            {children}
        </span>
    );
}
