import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useState, useCallback } from "react";
import { getLogo } from "../../lib/helpers";
import { EyeIcon, EyeOffIcon, Check, Copy } from "lucide-react";
import { usePrivacy } from "../shared/PrivacyProvider";

type Props = {
    id: number;
    name: string;
    balance: number;
    accountNumber?: string;
    selected?: boolean;
    compact?: boolean;
    onClick?: () => void;
};

const springConfig = { damping: 25, stiffness: 250, mass: 0.5 };

export default function AccountCard({ id, name, balance, accountNumber = "4242 5121 2421", selected = false, compact = false, onClick }: Props) {
    const { hidden: globalHidden } = usePrivacy();

    // Smooth tilt — shared between compact and full
    const mouseX = useMotionValue(0.5);
    const mouseY = useMotionValue(0.5);
    const rotateX = useSpring(useTransform(mouseY, [0, 1], [4, -4]), springConfig);
    const rotateY = useSpring(useTransform(mouseX, [0, 1], [-4, 4]), springConfig);

    const [isHidden, setIsHidden] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleMouse = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        mouseX.set((e.clientX - rect.left) / rect.width);
        mouseY.set((e.clientY - rect.top) / rect.height);
    }, [mouseX, mouseY]);

    const handleLeave = useCallback(() => {
        mouseX.set(0.5);
        mouseY.set(0.5);
    }, [mouseX, mouseY]);

    function copyAccountNumber() {
        if (accountNumber) {
            navigator.clipboard.writeText(accountNumber);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    }

    const masked = isHidden || globalHidden;
    const displayBalance = masked ? "••••" : `$${balance.toLocaleString()}`;
    const displayAccount = masked ? "•••• •••• ••••" : accountNumber;

    // ─── Compact Dashboard Card ─────────────────────────────
    if (compact) {
        return (
            <motion.div
                onClick={onClick}
                onMouseMove={handleMouse}
                onMouseLeave={handleLeave}
                whileTap={{ scale: 0.97, transition: { type: 'spring', damping: 15, stiffness: 400 } }}
                style={{
                    rotateX,
                    rotateY,
                    transformPerspective: 1000,
                    transformStyle: 'preserve-3d',
                }}
                className={`relative rounded-2xl p-5 cursor-pointer group
                    bg-[var(--card)] border border-[var(--card-border)]
                    hover:border-[var(--card-border-highlight)] transition-all duration-300
                    ${selected ? 'ring-2 ring-[var(--accent)] border-[var(--accent)]/30' : ''}`}
            >
                {/* Subtle shimmer sweep — contained within card */}
                <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
                    <div className="absolute top-0 left-[-100%] w-[60%] h-full bg-gradient-to-r from-transparent via-[var(--accent)]/[0.03] to-transparent group-hover:left-[150%] transition-all duration-[1200ms] ease-in-out" />
                </div>

                <div className="relative z-10">
                    {/* Header: logo + status */}
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-8 h-8 rounded-lg bg-[var(--muted-fill)] border border-[var(--card-border)] flex items-center justify-center">
                            <img src={getLogo(id)} alt="" className="w-4.5 h-4.5" />
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="relative flex h-1.5 w-1.5">
                                <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--success)] opacity-40 animate-ping" />
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[var(--success)]" />
                            </span>
                            <span className="text-[10px] text-[var(--success)] font-medium">Active</span>
                        </div>
                    </div>

                    {/* Bank name */}
                    <p className="text-caption truncate mb-1">{name}</p>

                    {/* Balance — prominent */}
                    <p className="text-subsection-title nums text-[var(--foreground)] tracking-tight mb-2">
                        {globalHidden ? '••••' : `$${balance.toLocaleString()}`}
                    </p>

                    {/* Account number */}
                    <p className="font-mono text-[10px] tracking-wider text-[var(--muted)]">{globalHidden ? '•••• ••••' : accountNumber}</p>
                </div>
            </motion.div>
        );
    }

    // ─── Full Card (Accounts Page) ──────────────────────────
    return (
        <motion.div
            onMouseMove={handleMouse}
            onMouseLeave={handleLeave}
            onClick={onClick}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
                rotateX,
                rotateY,
                transformPerspective: 1200,
                transformStyle: "preserve-3d",
            }}
            className={`w-full aspect-[1.6/1] rounded-2xl relative overflow-hidden group
                bg-[var(--card)] border border-[var(--card-border)]
                hover:border-[var(--card-border-highlight)]
                shadow-[var(--shadow-glass)]
                flex flex-col justify-between p-6 transition-all duration-300
                ${selected ? 'ring-2 ring-[var(--accent)]' : ''}
                ${onClick ? 'cursor-pointer' : ''}`}
        >
            {/* Shimmer line — contained */}
            <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
                <div className="absolute top-0 left-[-100%] w-[50%] h-full bg-gradient-to-r from-transparent via-[var(--accent)]/[0.04] to-transparent group-hover:left-[150%] transition-all duration-1000 ease-in-out" />
            </div>

            {/* Top Row */}
            <div style={{ transform: "translateZ(20px)" }} className="flex justify-between items-start relative z-10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[var(--muted-fill)] border border-[var(--card-border)] flex items-center justify-center">
                        <img src={getLogo(id)} alt="" className="w-6 h-6" />
                    </div>
                    <div>
                        <span className="text-body-title text-[var(--foreground)] line-clamp-1">{name}</span>
                        <span className="text-caption block">Savings Account</span>
                    </div>
                </div>

                {/* Status dot with radar ping */}
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--success)]/10">
                    <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--success)] opacity-40 animate-ping" />
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[var(--success)]" />
                    </span>
                    <span className="text-[10px] text-[var(--success)] font-medium">Active</span>
                </div>
            </div>

            {/* Balance */}
            <div style={{ transform: "translateZ(30px)" }} className="relative z-10">
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-display-sm nums tracking-tight text-[var(--foreground)]">{displayBalance}</span>
                    <button
                        onClick={(e) => { e.stopPropagation(); setIsHidden(p => !p); }}
                        className="w-6 h-6 rounded-lg bg-[var(--muted-fill)] flex items-center justify-center text-[var(--muted)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
                    >
                        {isHidden ? <EyeOffIcon size={14} /> : <EyeIcon size={14} />}
                    </button>
                </div>
            </div>

            {/* Bottom Section */}
            <div style={{ transform: "translateZ(25px)" }} className="relative z-10 flex items-end justify-between">
                <div>
                    <span className="text-overline block mb-1">Account</span>
                    <div className="flex items-center gap-2">
                        <span className="font-mono tracking-wider text-xs text-[var(--muted)]">{displayAccount}</span>
                        <button
                            onClick={(e) => { e.stopPropagation(); copyAccountNumber(); }}
                            className="w-5 h-5 rounded-md bg-[var(--muted-fill)] flex items-center justify-center text-[var(--muted)] hover:text-[var(--foreground)] transition-colors cursor-pointer relative"
                        >
                            {copied ? <Check size={12} className="text-[var(--success)]" /> : <Copy size={12} />}
                            {copied && (
                                <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-[9px] bg-[var(--slate-700)] text-white px-2 py-0.5 rounded whitespace-nowrap">
                                    Copied!
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                {/* Mini decorative chip */}
                <div className="w-9 h-7 rounded-md bg-[var(--muted-fill)] border border-[var(--card-border)] relative overflow-hidden">
                    <div className="absolute inset-[2px] grid grid-cols-2 gap-[1px]">
                        <div className="bg-[var(--foreground)]/5 rounded-sm" />
                        <div className="bg-[var(--foreground)]/3 rounded-sm" />
                        <div className="bg-[var(--foreground)]/3 rounded-sm" />
                        <div className="bg-[var(--foreground)]/5 rounded-sm" />
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
