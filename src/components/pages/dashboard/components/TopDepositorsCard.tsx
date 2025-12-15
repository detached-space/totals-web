import { TrendingUp, User } from "lucide-react";

export interface TopDepositorsCardProps {
  topDepositors: Array<{ name: string; amount: number; count: number }>;
}

export function TopDepositorsCard({ topDepositors }: TopDepositorsCardProps) {
  if (topDepositors.length === 0) {
    return (
      <div className="border rounded-lg p-4 bg-card">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-medium text-muted-foreground">
            Top Depositors
          </h3>
          <TrendingUp className="h-4 w-4 text-green-500" />
        </div>
        <div className="text-sm text-muted-foreground">No deposits found</div>
      </div>
    );
  }

  const topDepositor = topDepositors[0];
  const totalDeposits = topDepositors.reduce((sum, d) => sum + d.amount, 0);
  const percentage =
    totalDeposits > 0 ? (topDepositor.amount / totalDeposits) * 100 : 0;

  return (
    <div className="border rounded-lg p-4 bg-card">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-medium text-muted-foreground">
          Top Depositor
        </h3>
        <TrendingUp className="h-4 w-4 text-green-500" />
      </div>

      <div className="flex items-baseline gap-2 mb-1">
        <User className="h-5 w-5 text-green-500" />
        <div className="text-xl font-bold text-foreground truncate">
          {topDepositor.name || "Unknown"}
        </div>
      </div>

      <div className="text-sm font-semibold text-green-500 mb-2">
        ETB{" "}
        {topDepositor.amount.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </div>

      <div className="mt-3 pt-3 border-t border-border/50">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Transactions</span>
          <span className="font-semibold">{topDepositor.count}</span>
        </div>
        <div className="flex items-center justify-between text-xs mt-1">
          <span className="text-muted-foreground">Share</span>
          <span className="font-semibold">{percentage.toFixed(1)}%</span>
        </div>
        <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
        {topDepositors.length > 1 && (
          <div className="mt-2 text-xs text-muted-foreground">
            +{topDepositors.length - 1} more depositor
            {topDepositors.length - 1 !== 1 ? "s" : ""}
          </div>
        )}
      </div>
    </div>
  );
}
