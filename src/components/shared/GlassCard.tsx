import { motion, type HTMLMotionProps } from "framer-motion";
import { forwardRef } from "react";

interface GlassCardProps extends HTMLMotionProps<"div"> {
    hoverLift?: boolean;
    glassLevel?: 'sm' | 'md' | 'lg';
    padding?: 'none' | 'sm' | 'md' | 'lg';
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

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
    ({ children, className = '', hoverLift = true, glassLevel = 'md', padding = 'md', ...props }, ref) => {
        return (
            <motion.div
                ref={ref}
                whileHover={hoverLift ? { y: -2, transition: { duration: 0.2 } } : undefined}
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
