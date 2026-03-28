import { motion, useMotionValue, useTransform } from "framer-motion";
import { useState } from "react";
import { getGradient, getLogo } from "../../lib/helpers";
import { ClipboardIcon, EyeIcon, EyeOffIcon, Check } from "lucide-react";

type Props = {
    id: number;
    name: string;
    balance: number;
    accountNumber?: string;
    selected?: boolean;
    compact?: boolean;
    onClick?: () => void;
};

export default function AccountCard({ id, name, balance, accountNumber = "4242 5121 2421", selected = false, compact = false, onClick }: Props) {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useTransform(y, [0, 200], [5, -5]);
    const rotateY = useTransform(x, [0, 320], [-5, 5]);

    const [isHidden, setIsHidden] = useState(false);
    const [copied, setCopied] = useState(false);

    function handleMouse(event: React.MouseEvent<HTMLDivElement>) {
        const rect = event.currentTarget.getBoundingClientRect();
        x.set(event.clientX - rect.left);
        y.set(event.clientY - rect.top);
    }

    function handleMouseLeave() {
        x.set(160);
        y.set(100);
    }

    function copyAccountNumber() {
        if (accountNumber) {
            navigator.clipboard.writeText(accountNumber);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    }

    const displayBalance = isHidden ? "*****" : `$${balance.toLocaleString()}`;
    const displayAccount = isHidden ? "**** **** ****" : accountNumber;
    const background = getGradient(id);

    if (compact) {
        return (
            <motion.div
                onClick={onClick}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`relative rounded-2xl p-4 text-white cursor-pointer overflow-hidden ${selected ? 'ring-2 ring-[var(--accent)] ring-offset-2 ring-offset-[var(--background)]' : ''}`}
                style={{ background }}
            >
                <div className="flex items-center gap-3">
                    <img src={getLogo(id)} alt="" className="w-6 h-6 opacity-80" />
                    <div className="flex-1 min-w-0">
                        <p className="text-xs opacity-70 truncate">{name}</p>
                        <p className="font-bold text-lg">${balance.toLocaleString()}</p>
                    </div>
                </div>
                {/* Shimmer */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer pointer-events-none" />
            </motion.div>
        );
    }

    return (
        <div style={{ perspective: 1200 }} className="w-full h-full">
            <motion.div
                onMouseMove={handleMouse}
                onMouseLeave={handleMouseLeave}
                onClick={onClick}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d",
                    background,
                }}
                className={`w-full aspect-[1.586/1] rounded-2xl p-6 text-white relative shadow-2xl border border-white/10 flex flex-col justify-between group overflow-hidden ${selected ? 'ring-2 ring-[var(--accent)]' : ''} ${onClick ? 'cursor-pointer' : ''}`}
            >
                {/* Shimmer overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 animate-shimmer pointer-events-none" />

                {/* Top Row */}
                <div style={{ transform: "translateZ(30px)" }} className="flex justify-between items-start relative z-10 pointer-events-none">
                    <span className="font-semibold tracking-wide opacity-90 text-sm">{name}</span>
                    <img src={getLogo(id)} alt="" className="w-8 h-8 opacity-70" />
                </div>

                {/* Chip */}
                <div style={{ transform: "translateZ(25px)" }} className="relative z-10 my-3 pointer-events-none">
                    <div className="w-10 h-7 bg-yellow-200/20 rounded-md border border-yellow-200/30 relative overflow-hidden">
                        <div className="absolute inset-0 grid grid-cols-2 gap-[1px] bg-yellow-500/10" />
                    </div>
                </div>

                {/* Bottom Section */}
                <div style={{ transform: "translateZ(35px)" }} className="relative z-10 mt-auto pointer-events-auto">
                    <div className="mb-3 flex items-center gap-2">
                        <span className="text-2xl font-bold tracking-tight">{displayBalance}</span>
                        <button onClick={(e) => { e.stopPropagation(); setIsHidden(p => !p); }} className="w-5 h-5 opacity-70 hover:opacity-100 transition cursor-pointer">
                            {isHidden ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
                        </button>
                    </div>

                    <div className="flex justify-between items-end opacity-80">
                        <div className="flex flex-col gap-0.5">
                            <span className="text-[9px] uppercase tracking-wider opacity-60">Account</span>
                            <div className="flex items-center gap-2">
                                <span className="font-mono tracking-widest text-xs">{displayAccount}</span>
                                <button
                                    onClick={(e) => { e.stopPropagation(); copyAccountNumber(); }}
                                    className="w-4 h-4 opacity-70 hover:opacity-100 transition cursor-pointer relative"
                                >
                                    {copied ? <Check className="text-green-400" size={14} /> : <ClipboardIcon size={14} />}
                                    {copied && (
                                        <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-[9px] bg-black/80 px-2 py-0.5 rounded text-white whitespace-nowrap">
                                            Copied!
                                        </span>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Glossy Reflection */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-2xl mix-blend-overlay" />
            </motion.div>
        </div>
    );
}
