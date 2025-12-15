import { useMemo } from "react";
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import type { Transaction } from "../../../../lib/types";

export interface PieChartProps {
  transactions: Transaction[];
  dateFilter: "week" | "month" | "year" | "custom";
  transactionTypeFilter: "all" | "credit" | "debit";
  selectedBanks: number[];
  customStartDate?: string;
  customEndDate?: string;
}

const COLORS = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6"];

export function PieChart({
  transactions,
  dateFilter,
  transactionTypeFilter,
  selectedBanks,
  customStartDate,
  customEndDate,
}: PieChartProps) {
  // Filter and group data by bank
  const pieData = useMemo(() => {
    let filtered = [...transactions];

    // Filter by transaction type
    if (transactionTypeFilter === "credit") {
      filtered = filtered.filter((t) => t.type === "CREDIT");
    } else if (transactionTypeFilter === "debit") {
      filtered = filtered.filter((t) => t.type === "DEBIT");
    }

    // Filter by bank
    if (selectedBanks.length > 0) {
      filtered = filtered.filter(
        (t) => t.bankId && selectedBanks.includes(t.bankId)
      );
    }

    // Filter by date
    const now = new Date();
    let startDate: Date;
    let endDate: Date = new Date();

    if (dateFilter === "custom" && customStartDate && customEndDate) {
      startDate = new Date(customStartDate);
      endDate = new Date(customEndDate);
    } else {
      switch (dateFilter) {
        case "week": {
          const dayOfWeek = now.getDay();
          startDate = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() - dayOfWeek
          );
          break;
        }
        case "month": {
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        }
        case "year": {
          startDate = new Date(now.getFullYear(), 0, 1);
          break;
        }
        default:
          startDate = new Date(0);
      }
    }

    filtered = filtered.filter((t) => {
      if (!t.time) return false;
      const tDate = new Date(t.time);
      return tDate >= startDate && tDate <= endDate;
    });

    // Group by bank
    const grouped: Record<number, number> = {};

    filtered.forEach((t) => {
      if (!t.bankId) return;
      if (!grouped[t.bankId]) {
        grouped[t.bankId] = 0;
      }
      grouped[t.bankId] += Math.abs(t.amount);
    });

    return Object.entries(grouped).map(([bankId, value]) => ({
      name: `Bank ${bankId}`,
      value,
      bankId: parseInt(bankId),
    }));
  }, [
    transactions,
    transactionTypeFilter,
    selectedBanks,
    dateFilter,
    customStartDate,
    customEndDate,
  ]);

  return (
    <div className="border rounded-lg p-6 bg-card h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">
          Distribution by Bank
        </h3>
      </div>

      <div className="h-[300px] flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsPieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) =>
                `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`
              }
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "rgba(0,0,0,0.9)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "6px",
              }}
              formatter={(value: number) =>
                `ETB ${value.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`
              }
            />
            <Legend />
          </RechartsPieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
