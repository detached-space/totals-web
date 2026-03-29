import { useEffect, useRef } from "react";
import { useSpring, useTransform, motion, useInView } from "framer-motion";
import { usePrivacy } from "./PrivacyProvider";

interface AnimatedCounterProps {
    value: number;
    prefix?: string;
    suffix?: string;
    duration?: number;
    decimals?: number;
    className?: string;
}

export default function AnimatedCounter({
    value,
    prefix = "",
    suffix = "",
    duration = 1.2,
    decimals = 2,
    className = "",
}: AnimatedCounterProps) {
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true });
    const { hidden } = usePrivacy();

    const spring = useSpring(0, {
        duration: duration * 1000,
        bounce: 0,
    });

    const display = useTransform(spring, (current) => {
        if (hidden) return `${prefix}••••${suffix}`;
        return `${prefix}${current.toLocaleString('en-US', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
        })}${suffix}`;
    });

    useEffect(() => {
        if (isInView) {
            spring.set(value);
        }
    }, [isInView, value, spring]);

    return <motion.span ref={ref} className={className}>{display}</motion.span>;
}
