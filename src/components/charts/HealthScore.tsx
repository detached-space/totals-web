import { motion } from "framer-motion";

interface HealthScoreProps {
    score: number;
    label?: string;
}

export default function HealthScore({ score, label = "Financial Health" }: HealthScoreProps) {
    const clampedScore = Math.max(0, Math.min(100, score));
    const radius = 60;
    const circumference = Math.PI * radius;
    const offset = circumference - (clampedScore / 100) * circumference;

    const getColor = (s: number) => {
        if (s >= 75) return '#10B981';
        if (s >= 50) return '#f59e0b';
        return '#ef4444';
    };

    const color = getColor(clampedScore);

    // Endpoint position on semicircular arc
    const angle = (clampedScore / 100) * 180;
    const rad = ((180 - angle) * Math.PI) / 180;
    const endX = 70 + 60 * Math.cos(rad);
    const endY = 75 - 60 * Math.sin(rad);

    return (
        <div className="flex flex-col items-center gap-3">
            <div className="relative w-36 h-20">
                <svg viewBox="0 0 140 80" className="w-full h-full">
                    <defs>
                        <filter id="score-glow" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="4" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>
                    {/* Background arc */}
                    <path
                        d="M 10 75 A 60 60 0 0 1 130 75"
                        fill="none"
                        stroke="var(--card-border)"
                        strokeWidth="8"
                        strokeLinecap="round"
                    />
                    {/* Score arc */}
                    <motion.path
                        d="M 10 75 A 60 60 0 0 1 130 75"
                        fill="none"
                        stroke={color}
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: offset }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                    {/* Glowing endpoint */}
                    <motion.circle
                        cx={endX} cy={endY} r="5"
                        fill={color}
                        filter="url(#score-glow)"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2, duration: 0.3 }}
                    />
                </svg>

                {/* Center score with colored glow */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
                    <motion.span
                        className="text-display-sm nums font-bold"
                        style={{ color, textShadow: `0 0 20px ${color}40` }}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5, type: 'spring', damping: 12 }}
                    >
                        {clampedScore}
                    </motion.span>
                </div>
            </div>

            <p className="text-label-light">{label}</p>
        </div>
    );
}
