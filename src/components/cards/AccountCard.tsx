import { motion } from "framer-motion";

type Props = {
    name: string;
    balance: number;
    bg: string;
};

export default function AccountCard({ name, balance, bg }: Props) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full h-44 rounded-[var(--radius-card)] p-6 text-white shadow-[var(--shadow-soft)] relative overflow-hidden backdrop-blur-xl border border-[var(--color-card-border)]"
            style={{ background: bg }}
        >
            <div className="flex flex-col justify-between h-full">
                <span className="text-lg opacity-90">{name}</span>
                <span className="text-3xl font-semibold">${balance.toLocaleString()}</span>
            </div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
        </motion.div>
    );
}