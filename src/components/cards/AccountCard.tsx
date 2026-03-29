import { motion } from "framer-motion";
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

const popColors = ['#FEE440', '#00BBF9', '#F15BB5', '#00F5D4', '#9B5DE5', '#F77F00'];

export default function AccountCard({ id, name, balance, accountNumber = "4242 5121 2421", selected = false, compact = false, onClick }: Props) {
    const { hidden: globalHidden } = usePrivacy();
    const [isHidden, setIsHidden] = useState(false);
    const [copied, setCopied] = useState(false);

    const popColor = popColors[id % popColors.length];

    const copyAccountNumber = useCallback(() => {
        if (accountNumber) {
            navigator.clipboard.writeText(accountNumber);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    }, [accountNumber]);

    const masked = isHidden || globalHidden;
    const displayBalance = masked ? "----" : `$${balance.toLocaleString()}`;
    const displayAccount = masked ? "---- ---- ----" : accountNumber;

    if (compact) {
        return (
            <motion.div
                onClick={onClick}
                whileHover={{
                    x: -3,
                    y: -3,
                    boxShadow: `6px 6px 0px var(--card-border)`,
                    transition: { duration: 0.1 },
                }}
                whileTap={{
                    x: 2,
                    y: 2,
                    boxShadow: `0px 0px 0px var(--card-border)`,
                    transition: { duration: 0.05 },
                }}
                className={`relative rounded-lg p-4 cursor-pointer
                    bg-[var(--card)] border-[var(--border-width)] border-[var(--card-border)]
                    shadow-[var(--shadow-brutal)] transition-all
                    ${selected ? 'shadow-[var(--shadow-brutal-accent)] border-[var(--accent)]' : ''}`}
            >
                {/* Color stripe at top */}
                <div className="absolute top-0 left-0 right-0 h-1.5 rounded-t-md" style={{ background: popColor }} />

                <div className="relative z-10 mt-1">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-8 h-8 rounded-md border-[var(--border-width)] border-[var(--card-border)] flex items-center justify-center bg-[var(--muted-fill)]">
                            <img src={getLogo(id)} alt="" className="w-4.5 h-4.5" />
                        </div>
                        <span className="brutal-tag" style={{ background: popColor, color: '#1A1A2E' }}>
                            Active
                        </span>
                    </div>

                    <p className="text-caption truncate mb-1 font-bold">{name}</p>
                    <p className="text-subsection-title nums text-[var(--foreground)] tracking-tight mb-2">
                        {globalHidden ? '----' : `$${balance.toLocaleString()}`}
                    </p>
                    <p className="font-mono text-[10px] tracking-wider text-[var(--muted)] font-bold">
                        {globalHidden ? '---- ----' : accountNumber}
                    </p>
                </div>
            </motion.div>
        );
    }

    // Full Card
    return (
        <motion.div
            onClick={onClick}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ x: -3, y: -3, transition: { duration: 0.1 } }}
            whileTap={{ x: 2, y: 2, transition: { duration: 0.05 } }}
            className={`w-full aspect-[1.6/1] rounded-xl relative overflow-hidden
                bg-[var(--card)] border-[var(--border-width)] border-[var(--card-border)]
                shadow-[var(--shadow-brutal-lg)]
                flex flex-col justify-between p-6 transition-all
                ${selected ? 'shadow-[var(--shadow-brutal-accent)]' : ''}
                ${onClick ? 'cursor-pointer' : ''}`}
        >
            {/* Color stripe */}
            <div className="absolute top-0 left-0 right-0 h-2" style={{ background: popColor }} />

            {/* Top Row */}
            <div className="flex justify-between items-start relative z-10 mt-1">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[var(--muted-fill)] border-[var(--border-width)] border-[var(--card-border)] flex items-center justify-center">
                        <img src={getLogo(id)} alt="" className="w-6 h-6" />
                    </div>
                    <div>
                        <span className="text-body-title text-[var(--foreground)] line-clamp-1">{name}</span>
                        <span className="text-caption block">Savings Account</span>
                    </div>
                </div>

                <span className="brutal-tag" style={{ background: popColor, color: '#1A1A2E' }}>
                    Active
                </span>
            </div>

            {/* Balance */}
            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-display-sm nums tracking-tight text-[var(--foreground)]">{displayBalance}</span>
                    <button
                        onClick={(e) => { e.stopPropagation(); setIsHidden(p => !p); }}
                        className="w-7 h-7 rounded-md bg-[var(--muted-fill)] border-[var(--border-width)] border-[var(--card-border)] flex items-center justify-center text-[var(--muted)] hover:text-[var(--foreground)] cursor-pointer"
                    >
                        {isHidden ? <EyeOffIcon size={14} /> : <EyeIcon size={14} />}
                    </button>
                </div>
            </div>

            {/* Bottom */}
            <div className="relative z-10 flex items-end justify-between">
                <div>
                    <span className="text-overline block mb-1">Account</span>
                    <div className="flex items-center gap-2">
                        <span className="font-mono tracking-wider text-xs text-[var(--muted)] font-bold">{displayAccount}</span>
                        <button
                            onClick={(e) => { e.stopPropagation(); copyAccountNumber(); }}
                            className="w-6 h-6 rounded-md bg-[var(--muted-fill)] border-[var(--border-width)] border-[var(--card-border)] flex items-center justify-center text-[var(--muted)] hover:text-[var(--foreground)] cursor-pointer relative"
                        >
                            {copied ? <Check size={12} className="text-[var(--success)]" /> : <Copy size={12} />}
                            {copied && (
                                <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-[9px] bg-[var(--card-border)] text-white px-2 py-0.5 rounded font-bold whitespace-nowrap">
                                    Copied!
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                {/* Decorative chip */}
                <div className="w-9 h-7 rounded-md border-[var(--border-width)] border-[var(--card-border)]" style={{ background: popColor }} />
            </div>
        </motion.div>
    );
}
