import { TrendingUp, Building2 } from "lucide-react";

export interface MostCreditedBankCardProps {
  bankId: number | null;
  totalCredit: number;
  transactionCount: number;
  percentage: number;
  getBankName?: (bankId: number) => string;
}

export function MostCreditedBankCard({
  bankId,
  totalCredit,
  transactionCount,
  percentage,
  getBankName,
}: MostCreditedBankCardProps) {
  return (
    <div className="border rounded-lg p-4 bg-card">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-medium text-muted-foreground">
          Most Credited Bank
        </h3>
        <TrendingUp className="h-4 w-4 text-blue-500" />
      </div>

      <div className="flex items-baseline gap-2 mb-1">
        <Building2 className="h-5 w-5 text-blue-500" />
        <div className="text-xl font-bold text-foreground">
          {bankId !== null
            ? getBankName
              ? getBankName(bankId)
              : `Bank ${bankId}`
            : "N/A"}
        </div>
      </div>

      <div className="text-sm font-semibold text-blue-500 mb-2">
        ETB{" "}
        {totalCredit.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </div>

      <div className="mt-3 pt-3 border-t border-border/50">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Transactions</span>
          <span className="font-semibold">{transactionCount}</span>
        </div>
        <div className="flex items-center justify-between text-xs mt-1">
          <span className="text-muted-foreground">Share</span>
          <span className="font-semibold">{percentage.toFixed(1)}%</span>
        </div>
        <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}
