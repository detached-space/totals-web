import { motion, useSpring, useTransform, useMotionValue } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import AnimatedCounter from "../shared/AnimatedCounter";
import { bentoItemVariants } from "../layout/BentoGrid";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import { useCallback, useRef, useEffect, useState } from "react";

interface BalanceCardProps {
    total: number;
    trend?: number;
    sparklineData?: number[];
}

export default function BalanceCard({ total, trend = 12.5, sparklineData }: BalanceCardProps) {
    const isPositive = trend >= 0;
    const miniData = (sparklineData || [52, 58, 55, 62, 71, 68, 75, 82, 78, 95]).map((v, i) => ({ i, v }));
    const ref = useRef<HTMLDivElement>(null);

    // Parallax tilt
    const mouseX = useMotionValue(0.5);
    const mouseY = useMotionValue(0.5);
    const springConfig = { damping: 25, stiffness: 200 };
    const rotateX = useSpring(useTransform(mouseY, [0, 1], [4, -4]), springConfig);
    const rotateY = useSpring(useTransform(mouseX, [0, 1], [-4, 4]), springConfig);

    const handleMouse = useCallback((e: React.MouseEvent) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        mouseX.set((e.clientX - r.left) / r.width);
        mouseY.set((e.clientY - r.top) / r.height);
    }, [mouseX, mouseY]);

    const handleLeave = useCallback(() => {
        mouseX.set(0.5);
        mouseY.set(0.5);
    }, [mouseX, mouseY]);

    // Idle breathing for sparkline opacity
    const [breatheOpacity, setBreatheOpacity] = useState(0.5);
    useEffect(() => {
        let frame: number;
        const breathe = () => {
            setBreatheOpacity(0.4 + Math.sin(Date.now() / 2000) * 0.15);
            frame = requestAnimationFrame(breathe);
        };
        frame = requestAnimationFrame(breathe);
        return () => cancelAnimationFrame(frame);
    }, []);

    return (
        <motion.div
            ref={ref}
            variants={bentoItemVariants}
            onMouseMove={handleMouse}
            onMouseLeave={handleLeave}
            style={{
                rotateX,
                rotateY,
                transformPerspective: 1200,
                transformStyle: 'preserve-3d',
            }}
            className="glass-panel-lg p-10 relative overflow-hidden col-span-1 sm:col-span-2 group"
        >
            {/* Chromatic glow orbs */}
            <div className="absolute -top-24 -right-24 w-80 h-80 bg-[var(--accent)]/15 rounded-full blur-[120px] pointer-events-none group-hover:bg-[var(--accent)]/25 transition-all duration-1000" />
            <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-purple-500/8 rounded-full blur-[100px] pointer-events-none group-hover:bg-purple-500/15 transition-all duration-1000" />
            <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-pink-500/5 rounded-full blur-[80px] pointer-events-none animate-breathe" />

            <div className="relative z-10" style={{ transform: 'translateZ(20px)' }}>
                {/* Ultra-light label — mixed weight contrast */}
                <span className="text-label-light">Total Balance</span>

                <div className="flex items-end gap-5 mt-3 mb-6">
                    {/* The hero number — breath-taking size */}
                    <AnimatedCounter
                        value={total}
                        prefix="$"
                        decimals={2}
                        className="text-hero text-hero-bold text-[var(--foreground)] nums"
                    />

                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5, type: 'spring' }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold mb-3 ${
                            isPositive ? 'bg-[var(--success)]/15 text-[var(--success)]' : 'bg-[var(--danger)]/15 text-[var(--danger)]'
                        }`}
                    >
                        {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                        {isPositive ? '+' : ''}{trend}%
                    </motion.div>
                </div>

                {/* Breathing sparkline */}
                <div className="h-20 w-full max-w-md" style={{ opacity: breatheOpacity }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={miniData}>
                            <defs>
                                <linearGradient id="balanceSparkGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.4} />
                                    <stop offset="100%" stopColor="var(--accent)" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <Area
                                type="monotone"
                                dataKey="v"
                                stroke="var(--accent)"
                                strokeWidth={2}
                                fill="url(#balanceSparkGrad)"
                                isAnimationActive
                                animationDuration={2000}
                                animationEasing="ease-out"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </motion.div>
    );
}
