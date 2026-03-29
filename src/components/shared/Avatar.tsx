interface AvatarProps {
    initials?: string;
    src?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    ring?: boolean;
    ringColor?: string;
    online?: boolean;
    className?: string;
    bg?: string;
}

const sizeMap = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-lg',
    xl: 'w-20 h-20 text-2xl',
};

export default function Avatar({
    initials = "?",
    src,
    size = 'md',
    ring = false,
    ringColor = 'ring-[var(--accent)]',
    online,
    className = '',
    bg = 'bg-[var(--muted-fill)] text-[var(--foreground)]',
}: AvatarProps) {
    return (
        <div className={`relative inline-flex ${className}`}>
            <div className={`${sizeMap[size]} rounded-lg ${ring ? `ring-2 ${ringColor}` : ''} overflow-hidden flex items-center justify-center font-black border-[var(--border-width)] border-[var(--card-border)] ${bg}`}>
                {src ? (
                    <img src={src} alt="" className="w-full h-full object-cover" />
                ) : (
                    initials
                )}
            </div>
            {online !== undefined && (
                <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-sm border-2 border-[var(--card)] ${online ? 'bg-[var(--success)]' : 'bg-gray-500'}`} />
            )}
        </div>
    );
}
