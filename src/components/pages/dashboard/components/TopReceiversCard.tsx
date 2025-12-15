import { TrendingDown, User } from "lucide-react";

export interface TopReceiversCardProps {
  topReceivers: Array<{ name: string; amount: number; count: number }>;
}

export function TopReceiversCard({ topReceivers }: TopReceiversCardProps) {
  if (topReceivers.length === 0) {
    return (
      <div className="border rounded-lg p-4 bg-card">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-medium text-muted-foreground">
            Top Receivers
          </h3>
          <TrendingDown className="h-4 w-4 text-red-500" />
        </div>
        <div className="text-sm text-muted-foreground">No payments found</div>
      </div>
    );
  }

  const topReceiver = topReceivers[0];
  const totalPayments = topReceivers.reduce((sum, r) => sum + r.amount, 0);
  const percentage =
    totalPayments > 0 ? (topReceiver.amount / totalPayments) * 100 : 0;

  return (
    <div className="border rounded-lg p-4 bg-card">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-medium text-muted-foreground">
          Top Receiver
        </h3>
        <TrendingDown className="h-4 w-4 text-red-500" />
      </div>

      <div className="flex items-baseline gap-2 mb-1">
        <User className="h-5 w-5 text-red-500" />
        <div className="text-xl font-bold text-foreground truncate">
          {topReceiver.name || "Unknown"}
        </div>
      </div>

      <div className="text-sm font-semibold text-red-500 mb-2">
        ETB{" "}
        {topReceiver.amount.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </div>

      <div className="mt-3 pt-3 border-t border-border/50">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Transactions</span>
          <span className="font-semibold">{topReceiver.count}</span>
        </div>
        <div className="flex items-center justify-between text-xs mt-1">
          <span className="text-muted-foreground">Share</span>
          <span className="font-semibold">{percentage.toFixed(1)}%</span>
        </div>
        <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-red-500 transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
        {topReceivers.length > 1 && (
          <div className="mt-2 text-xs text-muted-foreground">
            +{topReceivers.length - 1} more receiver
            {topReceivers.length - 1 !== 1 ? "s" : ""}
          </div>
        )}
      </div>
    </div>
  );
}
