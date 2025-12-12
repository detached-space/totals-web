import { motion } from "framer-motion";


export default function AccountCard({ name, balance, bg }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full h-40 rounded-2xl text-white p-6 shadow-xl relative overflow-hidden"
            style={{ background: bg }}
        >
            <div className="flex flex-col h-full justify-between">
                <span className="text-lg font-medium opacity-90">{name}</span>
                <span className="text-3xl font-semibold">${balance.toLocaleString()}</span>
            </div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
        </motion.div>
    );
}