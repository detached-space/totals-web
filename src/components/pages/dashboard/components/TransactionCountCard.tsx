import { useState, useEffect } from "react";
import { Hash, ArrowUpRight } from "lucide-react";

export interface TransactionCountCardProps {
  count: number;
  previousCount?: number;
}

export function TransactionCountCard({
  count,
  previousCount,
}: TransactionCountCardProps) {
  const [displayCount, setDisplayCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
    const duration = 1000;
    const steps = 60;
    const increment = count / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(increment * step, count);
      setDisplayCount(Math.floor(current));

      if (step >= steps) {
        setDisplayCount(count);
        clearInterval(timer);
        setTimeout(() => setIsAnimating(false), 200);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [count]);

  const change = previousCount !== undefined ? count - previousCount : null;
  const changePercent =
    previousCount !== undefined && previousCount > 0
      ? ((change! / previousCount) * 100).toFixed(1)
      : null;

  return (
    <div className="border rounded-lg p-4 bg-card">
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-medium text-muted-foreground">
            Total Transactions
          </h3>
          <Hash className="h-4 w-4 text-blue-500" />
        </div>

        <div className="flex items-baseline gap-2 mb-1">
          <div
            className={`text-2xl font-bold text-foreground transition-all duration-300 ${
              isAnimating ? "scale-110" : "scale-100"
            }`}
          >
            {displayCount.toLocaleString()}
          </div>
        </div>

        {change !== null && change !== 0 && (
          <div
            className={`flex items-center gap-1 text-xs font-medium mt-2 ${
              change > 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            <ArrowUpRight
              className={`h-3 w-3 ${change < 0 ? "rotate-180" : ""}`}
            />
            <span>
              {change > 0 ? "+" : ""}
              {change.toLocaleString()}
              {changePercent && ` (${changePercent}%)`}
            </span>
          </div>
        )}

        <div className="mt-3 pt-3 border-t border-border/50">
          <div className="text-xs text-muted-foreground">
            {count > 0 ? "Active transactions" : "No transactions"}
          </div>
        </div>
      </div>
    </div>
  );
}
