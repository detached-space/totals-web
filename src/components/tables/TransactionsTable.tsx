import { ArrowDownLeft, ArrowUpRight, ArrowRight, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import type { Transaction } from "../../lib/types";

// Mock Data matching the new interface
const transactions: Transaction[] = [
    {
        amount: -9.99,
        reference: "Spotify Premium",
        creditor: "Spotify Ltd",
        time: "2023-10-24T10:23:00Z",
        status: "CLEARED",
        type: "DEBIT",
        transactionLink: "https://spotify.com",
        accountNumber: "8821",
        bankId: 2
    },
    {
        amount: -12.50,
        reference: "Uber Ride",
        creditor: "Uber Technologies",
        time: "2023-10-23T18:45:00Z",
        status: "PENDING",
        type: "DEBIT",
        transactionLink: "https://uber.com",
        accountNumber: "3321",
        bankId: 3
    },
    {
        amount: 2500.00,
        reference: "Salary Deposit",
        creditor: "Tech Corp Inc.",
        time: "2023-10-23T09:00:00Z",
        status: "CLEARED",
        type: "CREDIT",
        transactionLink: "https://bank.com",
        accountNumber: "8821",
        bankId: 2
    },
    {
        amount: -4.50,
        reference: "Starbucks Coffee",
        creditor: "Starbucks",
        time: "2023-10-22T08:30:00Z",
        status: "CLEARED",
        type: "DEBIT",
        transactionLink: "https://starbucks.com",
        accountNumber: "8821",
        bankId: 2
    },
    {
        amount: -120.00,
        reference: "Grocery Shopping",
        creditor: "Whole Foods",
        time: "2023-10-21T16:20:00Z",
        status: "SYNCED",
        type: "DEBIT",
        transactionLink: "https://wholefoods.com",
        accountNumber: "8821",
        bankId: 2
    },
];

export default function TransactionsTable() {
    return (
        <div className="glass-panel p-6 h-full overflow-hidden flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-[var(--color-foreground)]">Transactions</h3>
                <Link to="/transactions" className="text-sm text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1">
                    View All <ArrowRight size={14} />
                </Link>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                {transactions.map((t, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-[var(--color-foreground)]/5 transition-colors group cursor-pointer border border-transparent hover:border-[var(--color-card-border)]">
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${t.type === 'CREDIT' ? 'bg-green-500/20 text-green-400' : 'bg-[var(--color-foreground)]/10 text-[var(--color-foreground)]'}`}>
                                {t.type === 'CREDIT' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                            </div>
                            <div>
                                <h4 className="font-medium text-[var(--color-foreground)] line-clamp-1">{t.creditor || t.reference}</h4>
                                <p className="text-xs text-[var(--color-foreground)] opacity-50">
                                    {new Date(t.time || "").toLocaleDateString()} • {t.status}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <span className={`font-semibold ${t.type === 'CREDIT' ? 'text-green-400' : 'text-[var(--color-foreground)]'}`}>
                                {t.amount > 0 ? '+' : ''}{t.amount.toLocaleString()}
                            </span>
                            {t.transactionLink && (
                                <a
                                    href={t.transactionLink}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="opacity-0 group-hover:opacity-100 transition-opacity text-[var(--color-foreground)] hover:text-blue-400"
                                >
                                    <ExternalLink size={14} />
                                </a>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}