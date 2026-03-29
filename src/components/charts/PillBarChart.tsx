import { motion } from "framer-motion";

interface MonthlyData {
    month: string;
    spent: number;
    budget: number;
}

interface PillBarChartProps {
    data: MonthlyData[];
    height?: number;
}

const pillVariants = {
    hidden: { scaleY: 0 },
    visible: (i: number) => ({
        scaleY: 1,
        transition: {
            delay: 0.3 + i * 0.1,
            type: 'spring' as const,
            damping: 12,
            stiffness: 200,
        },
    }),
};

const labelVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: 0.5 + i * 0.1, duration: 0.3 },
    }),
};

const popColors = ['var(--pop-pink)', 'var(--pop-blue)', 'var(--pop-purple)', 'var(--pop-orange)', 'var(--pop-yellow)', 'var(--pop-green)', 'var(--accent)'];

export default function PillBarChart({ data, height = 240 }: PillBarChartProps) {
    const maxValue = Math.max(...data.map(d => Math.max(d.budget, d.spent)));

    return (
        <div className="flex items-end justify-center gap-4 sm:gap-6" style={{ height }}>
            {data.map((item, i) => {
                const barH = Math.max((item.budget / maxValue) * 0.85 * height, 40);
                const spentPct = Math.min((item.spent / item.budget) * 100, 100);
                const isOver = item.spent >= item.budget;
                const spentColor = popColors[i % popColors.length];

                return (
                    <div key={item.month} className="flex flex-col items-center gap-2 group">
                        {/* Value label */}
                        <motion.div
                            custom={i}
                            variants={labelVariants}
                            initial="hidden"
                            animate="visible"
                            className="text-[10px] font-black nums text-[var(--foreground)] whitespace-nowrap"
                        >
                            {Math.round((item.spent / item.budget) * 100)}%
                        </motion.div>

                        {/* Pill container — budget background is a distinct visible color */}
                        <div
                            className="relative w-9 sm:w-11 rounded-full overflow-hidden border-[var(--border-width)] border-[var(--card-border)] cursor-pointer group-hover:scale-105 transition-transform"
                            style={{
                                height: barH,
                                backgroundColor: 'var(--card-border)',
                            }}
                        >
                            {/* Spent fill from bottom */}
                            <motion.div
                                custom={i}
                                variants={pillVariants}
                                initial="hidden"
                                animate="visible"
                                className="absolute bottom-0 left-0 right-0 rounded-full"
                                style={{
                                    height: `${spentPct}%`,
                                    backgroundColor: spentColor,
                                    originY: 1,
                                }}
                            />

                            {/* Overspend stripes */}
                            {isOver && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 1 + i * 0.1 }}
                                    className="absolute inset-0 rounded-full"
                                    style={{
                                        background: `repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(0,0,0,0.15) 3px, rgba(0,0,0,0.15) 6px)`,
                                    }}
                                />
                            )}
                        </div>

                        {/* Month label */}
                        <motion.span
                            custom={i}
                            variants={labelVariants}
                            initial="hidden"
                            animate="visible"
                            className="text-[10px] font-black text-[var(--muted)] uppercase tracking-wider"
                        >
                            {item.month}
                        </motion.span>
                    </div>
                );
            })}
        </div>
    );
}
