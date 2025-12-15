import { useMemo } from "react";
import type { Transaction } from "../../../lib/types";
import type { TransactionTotals } from "./types";

interface TransactionTotalsBarProps {
  transactions: Transaction[];
  selectedTransactions: Transaction[];
}

export function TransactionTotalsBar({
  transactions,
  selectedTransactions,
}: TransactionTotalsBarProps) {
  const filteredTotals = useMemo<TransactionTotals>(() => {
    const inflow = transactions
      .filter((t) => t.type === "CREDIT" || t.amount > 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const outflow = transactions
      .filter((t) => t.type === "DEBIT" || t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    return {
      totalInflow: inflow,
      totalOutflow: outflow,
      netAmount: inflow - outflow,
      transactionCount: transactions.length,
    };
  }, [transactions]);

  const selectedTotals = useMemo<TransactionTotals>(() => {
    if (selectedTransactions.length === 0) {
      return {
        totalInflow: 0,
        totalOutflow: 0,
        netAmount: 0,
        transactionCount: 0,
      };
    }
    const inflow = selectedTransactions
      .filter((t) => t.type === "CREDIT" || t.amount > 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const outflow = selectedTransactions
      .filter((t) => t.type === "DEBIT" || t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    return {
      totalInflow: inflow,
      totalOutflow: outflow,
      netAmount: inflow - outflow,
      transactionCount: selectedTransactions.length,
    };
  }, [selectedTransactions]);

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="sticky  border-t border-[var(--color-card-border)] bg-[var(--color-background)] z-30 shadow-lg">
      <div className="px-4 py-2">
        <div className="grid grid-cols-4 gap-4">
          {/* Filtered Totals */}
          <div className="border-r border-[var(--color-card-border)] pr-4">
            <div className="text-[10px] text-[var(--color-foreground)]/50 mb-0.5">
              Filtered
            </div>
            <div className="space-y-0.5">
              <div className="flex justify-between text-xs">
                <span className="text-[var(--color-foreground)]/70">In:</span>
                <span className="text-green-600 font-medium">
                  +{formatAmount(filteredTotals.totalInflow)}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[var(--color-foreground)]/70">Out:</span>
                <span className="text-red-600 font-medium">
                  -{formatAmount(filteredTotals.totalOutflow)}
                </span>
              </div>
              <div className="flex justify-between text-xs font-semibold pt-0.5 border-t border-[var(--color-card-border)]">
                <span>Net:</span>
                <span
                  className={
                    filteredTotals.netAmount >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  {filteredTotals.netAmount >= 0 ? "+" : ""}
                  {formatAmount(filteredTotals.netAmount)}
                </span>
              </div>
              <div className="flex justify-between text-[10px] text-[var(--color-foreground)]/50">
                <span>Count:</span>
                <span>{filteredTotals.transactionCount}</span>
              </div>
            </div>
          </div>

          {/* Selected Totals */}
          <div className="border-r border-[var(--color-card-border)] pr-4">
            <div className="text-[10px] text-[var(--color-foreground)]/50 mb-0.5">
              Selected
            </div>
            <div className="space-y-0.5">
              <div className="flex justify-between text-xs">
                <span className="text-[var(--color-foreground)]/70">In:</span>
                <span className="text-green-600 font-medium">
                  +{formatAmount(selectedTotals.totalInflow)}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[var(--color-foreground)]/70">Out:</span>
                <span className="text-red-600 font-medium">
                  -{formatAmount(selectedTotals.totalOutflow)}
                </span>
              </div>
              <div className="flex justify-between text-xs font-semibold pt-0.5 border-t border-[var(--color-card-border)]">
                <span>Net:</span>
                <span
                  className={
                    selectedTotals.netAmount >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  {selectedTotals.netAmount >= 0 ? "+" : ""}
                  {formatAmount(selectedTotals.netAmount)}
                </span>
              </div>
              <div className="flex justify-between text-[10px] text-[var(--color-foreground)]/50">
                <span>Count:</span>
                <span>{selectedTotals.transactionCount}</span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="border-r border-[var(--color-card-border)] pr-4">
            <div className="text-[10px] text-[var(--color-foreground)]/50 mb-0.5">
              Stats
            </div>
            <div className="space-y-0.5 text-xs">
              <div className="flex justify-between">
                <span className="text-[var(--color-foreground)]/70">Avg:</span>
                <span className="font-medium">
                  {filteredTotals.transactionCount > 0
                    ? formatAmount(
                        (filteredTotals.totalInflow +
                          filteredTotals.totalOutflow) /
                          filteredTotals.transactionCount
                      )
                    : "0.00"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-foreground)]/70">Max:</span>
                <span className="font-medium">
                  {transactions.length > 0
                    ? formatAmount(
                        Math.max(...transactions.map((t) => Math.abs(t.amount)))
                      )
                    : "0.00"}
                </span>
              </div>
            </div>
          </div>

          {/* Reconciliation Status */}
          <div>
            <div className="text-[10px] text-[var(--color-foreground)]/50 mb-0.5">
              Recon
            </div>
            <div className="space-y-0.5 text-xs">
              <div className="flex justify-between">
                <span className="text-[var(--color-foreground)]/70">
                  Status:
                </span>
                <span
                  className={`font-medium ${
                    Math.abs(filteredTotals.netAmount) < 0.01
                      ? "text-green-600"
                      : "text-yellow-600"
                  }`}
                >
                  {Math.abs(filteredTotals.netAmount) < 0.01 ? "OK" : "!"}
                </span>
              </div>
              {Math.abs(filteredTotals.netAmount) >= 0.01 && (
                <div className="text-[10px] text-yellow-600">
                  {formatAmount(Math.abs(filteredTotals.netAmount))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
