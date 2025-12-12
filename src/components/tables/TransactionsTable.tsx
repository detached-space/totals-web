import { ShoppingBag, DollarSign, Coffee, Music } from "lucide-react";

const transactions = [
    { id: 1, name: "Spotify Premium", amount: -9.99, date: "Today, 10:23 AM", icon: Music, color: "bg-green-500/20 text-green-400" },
    { id: 2, name: "Design Salary", amount: 3500.00, date: "Yesterday, 5:00 PM", icon: DollarSign, color: "bg-blue-500/20 text-blue-400" },
    { id: 3, name: "Whole Foods", amount: -85.20, date: "Nov 2, 8:45 PM", icon: ShoppingBag, color: "bg-orange-500/20 text-orange-400" },
    { id: 4, name: "Starbucks", amount: -6.50, date: "Nov 1, 9:15 AM", icon: Coffee, color: "bg-yellow-500/20 text-yellow-400" },
    { id: 5, name: "Apple Store", amount: -1299.00, date: "Oct 28, 2:30 PM", icon: ShoppingBag, color: "bg-gray-500/20 text-gray-400" },
];

export default function TransactionsTable() {
    return (
        <div className="glass-panel p-6 h-full overflow-hidden flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-white/90">Transactions</h3>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                {transactions.map((t) => (
                    <div key={t.id} className="flex items-center justify-between group cursor-pointer p-2 rounded-xl hover:bg-white/5 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${t.color}`}>
                                <t.icon size={18} />
                            </div>
                            <div>
                                <p className="font-medium text-white/90 text-sm group-hover:text-white transition-colors">{t.name}</p>
                                <p className="text-xs text-white/50">{t.date}</p>
                            </div>
                        </div>
                        <span className={`font-semibold text-sm ${t.amount > 0 ? 'text-green-400' : 'text-white/80'}`}>
                            {t.amount > 0 ? '+' : ''}${Math.abs(t.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}