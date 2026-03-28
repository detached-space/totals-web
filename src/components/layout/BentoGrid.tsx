import { motion } from "framer-motion";

interface BentoGridProps {
    children: React.ReactNode;
    columns?: 2 | 3 | 4;
    gap?: 'sm' | 'md' | 'lg';
    className?: string;
    stagger?: boolean;
}

const gapMap = {
    sm: 'gap-3',
    md: 'gap-5',
    lg: 'gap-6',
};

const colMap = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
};

const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.06,
        },
    },
};

export const bentoItemVariants = {
    hidden: { opacity: 0, y: 16, scale: 0.98 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] },
    },
};

export default function BentoGrid({ children, columns = 4, gap = 'md', className = '', stagger = true }: BentoGridProps) {
    if (stagger) {
        return (
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className={`grid ${colMap[columns]} ${gapMap[gap]} ${className}`}
            >
                {children}
            </motion.div>
        );
    }

    return (
        <div className={`grid ${colMap[columns]} ${gapMap[gap]} ${className}`}>
            {children}
        </div>
    );
}
