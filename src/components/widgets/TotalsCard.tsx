import { ArrowRight, Wallet } from "lucide-react";
import { Link } from "react-router-dom";
import { getLogo } from "../../lib/utils";


export default function TotalsCard({ accounts }: { accounts: any[] }) {
    return (
        <div className="glass-panel p-8 relative overflow-hidden group">
            {/* Background Gradient Blob */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px] pointer-events-none group-hover:bg-blue-500/30 transition-colors duration-500" />

            <div className="relative z-10 flex flex-col h-full justify-between gap-6">
                <div className="flex justify-between items-start">
                    <div className="p-3 bg-[var(--color-foreground)]/5 rounded-2xl border border-[var(--color-card-border)]">
                        <Wallet className="text-[var(--color-foreground)] opacity-80" size={24} />
                    </div>
                    <Link to="/accounts" className="glass-button px-3 py-1.5 rounded-lg text-xs font-medium text-[var(--color-foreground)] flex items-center gap-1 opacity-70 hover:opacity-100">
                        View All <ArrowRight size={12} />
                    </Link>
                </div>

                <div>
                    <span className="text-sm font-medium text-[var(--color-foreground)] opacity-60 uppercase tracking-wider">Total Balance</span>
                    <h2 className="text-4xl font-bold text-[var(--color-foreground)] mt-1 tracking-tight">{accounts.reduce((total, account) => total + account.balance, 0)}</h2>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-[var(--color-card-border)]">
                    <span className="text-sm font-medium text-[var(--color-foreground)] opacity-70">
                        <strong className="text-[var(--color-foreground)]">{accounts.length}</strong> Connected Accounts
                    </span>

                    <div className="flex items-center -space-x-3">
                        {accounts.slice(0, 4).map((account, i) => (
                            <div key={i} className="w-8 h-8 rounded-full border-2 border-[var(--color-card)] bg-white flex items-center justify-center overflow-hidden shadow-sm">
                                <img src={getLogo(account.id)} className="w-5 h-5 object-contain" />
                            </div>
                        ))}
                        {accounts.length > 4 && (
                            <div className="w-8 h-8 rounded-full border-2 border-[var(--color-card)] bg-[var(--color-foreground)] flex items-center justify-center text-[var(--color-background)] text-[10px] font-bold shadow-sm">
                                +{accounts.length - 4}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
