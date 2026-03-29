import { motion, useMotionValue, useTransform, useSpring, type HTMLMotionProps } from "framer-motion";
import { forwardRef, useRef, useCallback } from "react";

interface GlassCardProps extends HTMLMotionProps<"div"> {
    hoverLift?: boolean;
    glassLevel?: 'sm' | 'md' | 'lg';
    padding?: 'none' | 'sm' | 'md' | 'lg';
    tilt?: boolean;
    glow?: boolean;
    glowColor?: string;
}

const paddingMap = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
};

const glassMap = {
    sm: 'glass-panel-sm',
    md: 'glass-panel',
    lg: 'glass-panel-lg',
};

const springConfig = { damping: 30, stiffness: 300, mass: 0.5 };

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
    ({
        children,
        className = '',
        hoverLift = true,
        glassLevel = 'md',
        padding = 'md',
        tilt = true,
        glow = true,
        glowColor,
        ...props
    }, forwardedRef) => {
        const localRef = useRef<HTMLDivElement>(null);

        const mouseX = useMotionValue(0.5);
        const mouseY = useMotionValue(0.5);

        const rotateX = useSpring(useTransform(mouseY, [0, 1], [3, -3]), springConfig);
        const rotateY = useSpring(useTransform(mouseX, [0, 1], [-3, 3]), springConfig);
        void glowColor; // used in CSS hover glow via glass-panel styles

        const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
            const el = localRef.current;
            if (!el) return;
            const rect = el.getBoundingClientRect();
            mouseX.set((e.clientX - rect.left) / rect.width);
            mouseY.set((e.clientY - rect.top) / rect.height);
        }, [mouseX, mouseY]);

        const handleMouseLeave = useCallback(() => {
            mouseX.set(0.5);
            mouseY.set(0.5);
        }, [mouseX, mouseY]);

        return (
            <motion.div
                ref={(node) => {
                    (localRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
                    if (typeof forwardedRef === 'function') forwardedRef(node);
                    else if (forwardedRef) (forwardedRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
                }}
                onMouseMove={tilt ? handleMouseMove : undefined}
                onMouseLeave={tilt ? handleMouseLeave : undefined}
                whileHover={hoverLift ? { y: -3, transition: { type: 'spring', damping: 20, stiffness: 300 } } : undefined}
                whileTap={hoverLift ? { scale: 0.985, transition: { type: 'spring', damping: 15, stiffness: 400 } } : undefined}
                style={tilt ? {
                    rotateX,
                    rotateY,
                    transformPerspective: 1200,
                    transformStyle: 'preserve-3d',
                } : undefined}
                className={`${glassMap[glassLevel]} ${paddingMap[padding]} ${className}`}
                {...props}
            >
                {children}
            </motion.div>
        );
    }
);

GlassCard.displayName = 'GlassCard';
export default GlassCard;
