interface BadgeProps {
    variant: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
    children: React.ReactNode;
    size?: 'sm' | 'md';
    dot?: boolean;
    pulse?: boolean;
}

const variantStyles = {
    success: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
    warning: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
    danger: 'bg-red-500/15 text-red-400 border-red-500/20',
    info: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
    neutral: 'bg-[var(--foreground)]/5 text-[var(--muted)] border-[var(--card-border)]',
};

const dotColors = {
    success: 'bg-emerald-400',
    warning: 'bg-amber-400',
    danger: 'bg-red-400',
    info: 'bg-blue-400',
    neutral: 'bg-gray-400',
};

export default function Badge({ variant, children, size = 'sm', dot = false, pulse = false }: BadgeProps) {
    return (
        <span className={`inline-flex items-center gap-1.5 border rounded-full font-medium ${variantStyles[variant]} ${size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs'}`}>
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
