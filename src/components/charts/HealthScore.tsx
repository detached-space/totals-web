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
        if (s >= 75) return 'var(--success)';
        if (s >= 50) return 'var(--warning)';
        return 'var(--danger)';
    };

    const color = getColor(clampedScore);

    return (
        <div className="flex flex-col items-center gap-3">
            <div className="relative w-36 h-20">
                <svg viewBox="0 0 140 80" className="w-full h-full">
                    {/* Background arc */}
                    <path
                        d="M 10 75 A 60 60 0 0 1 130 75"
                        fill="none"
                        stroke="var(--card-border)"
                        strokeWidth="10"
                        strokeLinecap="butt"
                    />
                    {/* Score arc */}
                    <motion.path
                        d="M 10 75 A 60 60 0 0 1 130 75"
                        fill="none"
                        stroke={color}
                        strokeWidth="10"
                        strokeLinecap="butt"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: offset }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                    />
                </svg>

                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
                    <motion.span
                        className="text-display-sm nums font-black"
                        style={{ color }}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4, duration: 0.3 }}
                    >
                        {clampedScore}
                    </motion.span>
                </div>
            </div>

            <p className="text-label-light">{label}</p>
        </div>
    );
}
