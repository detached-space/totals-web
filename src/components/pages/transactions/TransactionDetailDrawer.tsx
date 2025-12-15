import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../../ui/sheet";
import { Badge } from "../../ui/badge";
import type { Transaction } from "../../../lib/types";
import { format } from "date-fns";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Shield,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Building2,
  User,
  Tag,
  FileText,
  Code,
  History,
  ExternalLink,
  Clock,
  MessageSquare,
} from "lucide-react";

interface TransactionDetailDrawerProps {
  transaction: Transaction | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TransactionDetailDrawer({
  transaction,
  open,
  onOpenChange,
  getBankName,
}: TransactionDetailDrawerProps & {
  getBankName?: (bankId?: number) => string;
}) {
  if (!transaction) return null;

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Math.abs(amount));
  };

  const getDirectionIcon = () => {
    if (transaction.type === "CREDIT" || transaction.amount > 0) {
      return <ArrowDownLeft className="text-green-500" size={24} />;
    }
    return <ArrowUpRight className="text-red-500" size={24} />;
  };

  const isInflow = transaction.type === "CREDIT" || transaction.amount > 0;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-2xl p-8 overflow-y-auto"
      >
        <SheetHeader className="pb-4 border-b border-[var(--color-card-border)]">
          <SheetTitle className="flex items-center gap-3 text-xl">
            {getDirectionIcon()}
            <span>Transaction Details</span>
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {/* Amount Hero Section */}
          <div className="glass-panel p-6 rounded-xl border border-[var(--color-card-border)]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-[var(--color-foreground)]/60">
                Amount
              </span>
              <Badge
                className={
                  transaction.status === "CLEARED"
                    ? "bg-green-500/20 text-green-600 border-green-500/30"
                    : transaction.status === "PENDING"
                    ? "bg-yellow-500/20 text-yellow-600 border-yellow-500/30"
                    : "bg-gray-500/20 text-gray-600 border-gray-500/30"
                }
                variant="outline"
              >
                {transaction.status || "Unknown"}
              </Badge>
            </div>
            <div className="text-3xl font-bold">
              <span className={isInflow ? "text-green-600" : "text-red-600"}>
                {isInflow ? "+" : "-"}
                {formatAmount(transaction.amount)}
              </span>
              <span className="text-lg text-[var(--color-foreground)]/60 ml-2">
                {transaction.currency || "ETB"}
              </span>
            </div>
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="glass-panel p-4 rounded-lg border border-[var(--color-card-border)]">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-[var(--color-foreground)]/50" />
                <span className="text-xs font-medium text-[var(--color-foreground)]/60">
                  Date & Time
                </span>
              </div>
              <p className="text-sm font-medium">
                {transaction.time
                  ? format(new Date(transaction.time), "MMM dd, yyyy")
                  : "N/A"}
              </p>
              {transaction.time && (
                <p className="text-xs text-[var(--color-foreground)]/50 mt-0.5">
                  {format(new Date(transaction.time), "h:mm a")}
                </p>
              )}
            </div>

            <div className="glass-panel p-4 rounded-lg border border-[var(--color-card-border)]">
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="w-4 h-4 text-[var(--color-foreground)]/50" />
                <span className="text-xs font-medium text-[var(--color-foreground)]/60">
                  Bank & Account
                </span>
              </div>
              <p className="text-sm font-medium">
                {getBankName
                  ? getBankName(transaction.bankId)
                  : `Bank ${transaction.bankId || "N/A"}`}
              </p>
              <p className="text-xs text-[var(--color-foreground)]/50 mt-0.5">
                {transaction.accountNumber || "No account"}
              </p>
            </div>
          </div>

          {/* Transaction Details Card */}
          <div className="glass-panel p-5 rounded-xl border border-[var(--color-card-border)]">
            <h3 className="text-sm font-semibold mb-4 text-[var(--color-foreground)] flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Transaction Details
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-[var(--color-foreground)]/60 mb-1 block">
                  Reference
                </label>
                <p className="text-sm font-medium">
                  {transaction.reference || "No reference"}
                </p>
              </div>

              <div>
                <label className="text-xs font-medium text-[var(--color-foreground)]/60 mb-1 flex items-center gap-1">
                  <User className="w-3 h-3" />
                  Counterparty
                </label>
                <p className="text-sm font-medium">
                  {transaction.counterparty ||
                    transaction.creditor ||
                    transaction.receiver ||
                    "Unknown"}
                </p>
              </div>

              <div>
                <label className="text-xs font-medium text-[var(--color-foreground)]/60 mb-1 flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  Category
                </label>
                <Badge variant="outline" className="mt-1">
                  {transaction.category || "Uncategorized"}
                </Badge>
              </div>

              {transaction.tags && transaction.tags.length > 0 && (
                <div>
                  <label className="text-xs font-medium text-[var(--color-foreground)]/60 mb-2 block">
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {transaction.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {transaction.notes && (
                <div>
                  <label className="text-xs font-medium text-[var(--color-foreground)]/60 mb-1 block">
                    Notes
                  </label>
                  <p className="text-sm whitespace-pre-wrap bg-[var(--color-foreground)]/5 p-3 rounded-lg border border-[var(--color-card-border)]">
                    {transaction.notes}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Flags Section */}
          {(transaction.isFlagged ||
            transaction.isDuplicate ||
            transaction.isReviewed !== undefined) && (
            <div className="glass-panel p-5 rounded-xl border border-[var(--color-card-border)]">
              <h3 className="text-sm font-semibold mb-3 text-[var(--color-foreground)] flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Flags & Status
              </h3>
              <div className="flex flex-wrap gap-2">
                {transaction.isFlagged && (
                  <Badge
                    className="bg-red-500/20 text-red-600 border-red-500/30"
                    variant="outline"
                  >
                    <AlertTriangle size={12} className="mr-1.5" />
                    Flagged
                  </Badge>
                )}
                {transaction.isDuplicate && (
                  <Badge
                    className="bg-yellow-500/20 text-yellow-600 border-yellow-500/30"
                    variant="outline"
                  >
                    <AlertTriangle size={12} className="mr-1.5" />
                    Duplicate
                  </Badge>
                )}
                {transaction.isReviewed && (
                  <Badge
                    className="bg-green-500/20 text-green-600 border-green-500/30"
                    variant="outline"
                  >
                    <CheckCircle size={12} className="mr-1.5" />
                    Reviewed
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Raw SMS Content */}
          <div className="glass-panel p-5 rounded-xl border border-[var(--color-card-border)]">
            <h3 className="text-sm font-semibold mb-3 text-[var(--color-foreground)] flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-500" />
              Raw SMS Content
            </h3>
            <div className="bg-[var(--color-foreground)]/5 p-4 rounded-lg border border-[var(--color-card-border)]">
              <p className="text-xs font-mono whitespace-pre-wrap text-[var(--color-foreground)]/80 leading-relaxed">
                {transaction.rawSms || "No raw SMS available"}
              </p>
            </div>
            {(transaction.smsSenderId || transaction.smsReceivedAt) && (
              <div className="mt-3 flex items-center gap-4 text-xs text-[var(--color-foreground)]/50">
                {transaction.smsSenderId && (
                  <div className="flex items-center gap-1.5">
                    <MessageSquare className="w-3 h-3" />
                    <span>Sender: {transaction.smsSenderId}</span>
                  </div>
                )}
                {transaction.smsReceivedAt && (
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3 h-3" />
                    <span>
                      Received:{" "}
                      {format(
                        new Date(transaction.smsReceivedAt),
                        "MMM dd, h:mm a"
                      )}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Parsing Metadata */}
          {(transaction.parsingConfidence !== undefined ||
            transaction.parsingRegex ||
            transaction.parsingErrors) && (
            <div className="glass-panel p-5 rounded-xl border border-[var(--color-card-border)]">
              <h3 className="text-sm font-semibold mb-3 text-[var(--color-foreground)] flex items-center gap-2">
                <Code className="w-4 h-4" />
                Parsing Metadata
              </h3>
              <div className="space-y-4">
                {transaction.parsingConfidence !== undefined && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-[var(--color-foreground)]/70">
                        Confidence Score
                      </span>
                      <span className="text-xs font-bold">
                        {transaction.parsingConfidence}%
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-[var(--color-foreground)]/10 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          transaction.parsingConfidence >= 80
                            ? "bg-green-500"
                            : transaction.parsingConfidence >= 50
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                        style={{ width: `${transaction.parsingConfidence}%` }}
                      />
                    </div>
                  </div>
                )}

                {transaction.parsingRegex && (
                  <div>
                    <label className="text-xs font-medium text-[var(--color-foreground)]/70 mb-2 block">
                      Regex Pattern
                    </label>
                    <div className="bg-[var(--color-foreground)]/5 p-3 rounded-lg border border-[var(--color-card-border)]">
                      <code className="text-xs font-mono text-[var(--color-foreground)]/80">
                        {transaction.parsingRegex}
                      </code>
                    </div>
                  </div>
                )}

                {transaction.parsingErrors &&
                  transaction.parsingErrors.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-500" />
                        <span className="text-xs font-medium text-yellow-600">
                          Parsing Errors
                        </span>
                      </div>
                      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                        <ul className="list-disc list-inside text-xs text-yellow-600 space-y-1">
                          {transaction.parsingErrors.map((error, idx) => (
                            <li key={idx}>{error}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
              </div>
            </div>
          )}

          {/* Audit Trail */}
          {transaction.auditTrail && transaction.auditTrail.length > 0 && (
            <div className="glass-panel p-5 rounded-xl border border-[var(--color-card-border)]">
              <h3 className="text-sm font-semibold mb-4 text-[var(--color-foreground)] flex items-center gap-2">
                <History className="w-4 h-4" />
                Audit Trail
              </h3>
              <div className="space-y-3">
                {transaction.auditTrail.map((entry, idx) => (
                  <div
                    key={idx}
                    className="bg-[var(--color-foreground)]/5 p-4 rounded-lg border border-[var(--color-card-border)]"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-sm font-semibold">
                          {entry.userName}
                        </p>
                        <p className="text-xs text-[var(--color-foreground)]/50 mt-0.5">
                          {format(
                            new Date(entry.timestamp),
                            "MMM dd, yyyy 'at' h:mm a"
                          )}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {entry.action}
                      </Badge>
                    </div>
                    {entry.field && (
                      <div className="mt-3 pt-3 border-t border-[var(--color-card-border)]">
                        <div className="text-xs">
                          <span className="text-[var(--color-foreground)]/60">
                            Field:{" "}
                          </span>
                          <span className="font-medium">{entry.field}</span>
                          {entry.oldValue !== undefined &&
                            entry.newValue !== undefined && (
                              <div className="mt-2 space-y-1.5">
                                <div className="flex items-center gap-2">
                                  <span className="text-red-600 line-through text-xs">
                                    {entry.oldValue}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <ArrowDownLeft className="w-3 h-3 text-green-600" />
                                  <span className="text-green-600 font-medium text-xs">
                                    {entry.newValue}
                                  </span>
                                </div>
                              </div>
                            )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Transaction Link */}
          {transaction.transactionLink && (
            <div className="glass-panel p-5 rounded-xl border border-[var(--color-card-border)]">
              <a
                href={transaction.transactionLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm font-medium text-blue-500 hover:text-blue-400 transition-colors group"
              >
                <ExternalLink className="w-4 h-4" />
                <span>View Original Transaction</span>
                <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
