import { ArrowUpRight, ArrowDownLeft, ExternalLink } from "lucide-react";
import type { Transaction } from "../../lib/types";
import { getBankName } from "../../lib/helpers";
import Badge from "../shared/Badge";
import { usePrivacy } from "../shared/PrivacyProvider";

interface TransactionItemProps {
    transaction: Transaction;
    compact?: boolean;
}

const statusVariant = {
    PENDING: 'warning' as const,
    CLEARED: 'success' as const,
    SYNCED: 'info' as const,
};

export default function TransactionItem({ transaction: t, compact = false }: TransactionItemProps) {
    const { hidden } = usePrivacy();
    const isCredit = t.type === 'CREDIT';
    const amountDisplay = hidden ? '••••' : `$${Math.abs(t.amount).toLocaleString()}`;

    if (compact) {
        return (
            <div className="flex items-center justify-between py-2.5 group">
                <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        isCredit ? 'bg-[var(--success)]/15 text-[var(--success)]' : 'bg-[var(--foreground)]/5 text-[var(--muted)]'
                    }`}>
                        {isCredit ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                    </div>
                    <div>
                        <p className="text-body-title text-[var(--foreground)] line-clamp-1">{t.creditor || t.reference}</p>
                        <p className="text-caption">
                            {t.time ? new Date(t.time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}
                        </p>
                    </div>
                </div>
                <span className={`text-sm font-semibold nums ${isCredit ? 'text-[var(--success)]' : 'text-[var(--foreground)]'}`}>
                    {isCredit ? '+' : '-'}{amountDisplay}
                </span>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-between p-3.5 rounded-xl hover:bg-[var(--foreground)]/3 transition-colors group cursor-pointer">
            <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    isCredit ? 'bg-[var(--success)]/15 text-[var(--success)]' : 'bg-[var(--foreground)]/5 text-[var(--muted)]'
                }`}>
                    {isCredit ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                </div>
                <div>
                    <h4 className="text-body-title text-[var(--foreground)] line-clamp-1">{t.creditor || t.reference}</h4>
                    <p className="text-caption">
                        {t.bankId ? getBankName(t.bankId) : ''}{t.time ? ` · ${new Date(t.time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` : ''}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-3">
                {t.status && (
                    <Badge variant={statusVariant[t.status as keyof typeof statusVariant] || 'neutral'} dot>
                        {t.status}
                    </Badge>
                )}
                <span className={`font-semibold text-sm nums ${isCredit ? 'text-[var(--success)]' : 'text-[var(--foreground)]'}`}>
                    {isCredit ? '+' : '-'}{amountDisplay}
                </span>
                {t.transactionLink && (
                    <a
                        href={t.transactionLink}
                        target="_blank"
                        rel="noreferrer"
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-[var(--muted)] hover:text-[var(--accent)]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <ExternalLink size={14} />
                    </a>
                )}
            </div>
        </div>
    );
}
