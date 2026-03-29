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
    ringColor = 'ring-blue-500/50',
    online,
    className = '',
    bg = 'bg-[var(--foreground)]/10 text-[var(--foreground)]',
}: AvatarProps) {
    return (
        <div className={`relative inline-flex ${className}`}>
            <div className={`${sizeMap[size]} rounded-full ${ring ? `ring-2 ${ringColor}` : ''} overflow-hidden flex items-center justify-center font-bold ${bg}`}>
                {src ? (
                    <img src={src} alt="" className="w-full h-full object-cover" />
                ) : (
                    initials
                )}
            </div>
            {online !== undefined && (
                <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[var(--background)] ${online ? 'bg-[var(--success)]' : 'bg-gray-500'}`} />
            )}
        </div>
    );
}
