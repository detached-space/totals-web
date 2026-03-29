import { motion, type HTMLMotionProps } from "framer-motion";
import { forwardRef } from "react";

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

const panelMap = {
    sm: 'glass-panel-sm',
    md: 'glass-panel',
    lg: 'glass-panel-lg',
};

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
    ({
        children,
        className = '',
        hoverLift = true,
        glassLevel = 'md',
        padding = 'md',
        ...props
    }, ref) => {
        return (
            <motion.div
                ref={ref}
                whileHover={hoverLift ? {
                    x: -2,
                    y: -2,
                    transition: { duration: 0.1 },
                } : undefined}
                whileTap={hoverLift ? {
                    x: 2,
                    y: 2,
                    transition: { duration: 0.05 },
                } : undefined}
                className={`${panelMap[glassLevel]} ${paddingMap[padding]} ${className}`}
                {...props}
            >
                {children}
            </motion.div>
        );
    }
);

GlassCard.displayName = 'GlassCard';
export default GlassCard;
