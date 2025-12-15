import { useMemo } from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../ui/select";
import type { Transaction } from "../../../../lib/types";

export interface LineBarChartProps {
  transactions: Transaction[];
  chartType: "line" | "bar";
  onChartTypeChange: (type: "line" | "bar") => void;
  dateFilter: "week" | "month" | "year" | "custom";
  transactionTypeFilter: "all" | "credit" | "debit";
  selectedBanks: number[];
  customStartDate?: string;
  customEndDate?: string;
}

export function LineBarChart({
  transactions,
  chartType,
  onChartTypeChange,
  dateFilter,
  transactionTypeFilter,
  selectedBanks,
  customStartDate,
  customEndDate,
}: LineBarChartProps) {
  // Filter and group data
  const chartData = useMemo(() => {
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

    // Group by date based on filter
    const grouped: Record<
      string,
      { credit: number; debit: number; date: string }
    > = {};

    filtered.forEach((t) => {
      if (!t.time) return;
      const date = new Date(t.time);
      let key: string;

      switch (dateFilter) {
        case "week":
          key = date.toISOString().split("T")[0]; // Daily for week view
          break;
        case "month":
          key = date.toISOString().split("T")[0]; // Daily for month view
          break;
        case "year":
          key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
            2,
            "0"
          )}`; // Monthly for year view
          break;
        default:
          key = date.toISOString().split("T")[0];
      }

      if (!grouped[key]) {
        grouped[key] = { credit: 0, debit: 0, date: key };
      }

      if (t.type === "CREDIT") {
        grouped[key].credit += t.amount;
      } else if (t.type === "DEBIT") {
        grouped[key].debit += Math.abs(t.amount);
      }
    });

    return Object.entries(grouped)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, values]) => ({
        date,
        credit: values.credit,
        debit: values.debit,
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
          Income vs Expense
        </h3>
        <div className="flex items-center gap-2">
          <Select value={chartType} onValueChange={onChartTypeChange}>
            <SelectTrigger className="w-[100px] h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="line">Line</SelectItem>
              <SelectItem value="bar">Bar</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="h-[300px] flex-1 min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "line" ? (
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorCredit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorDebit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.05)"
              />
              <XAxis
                dataKey="date"
                stroke="rgba(255,255,255,0.3)"
                tick={{ fontSize: 11 }}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  background: "rgba(0,0,0,0.9)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "6px",
                }}
                labelStyle={{ color: "#fff", fontSize: "11px" }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="credit"
                stroke="#3b82f6"
                fillOpacity={1}
                fill="url(#colorCredit)"
                name="Credit"
              />
              <Area
                type="monotone"
                dataKey="debit"
                stroke="#ef4444"
                fillOpacity={1}
                fill="url(#colorDebit)"
                name="Debit"
              />
            </AreaChart>
          ) : (
            <BarChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.05)"
              />
              <XAxis
                dataKey="date"
                stroke="rgba(255,255,255,0.3)"
                tick={{ fontSize: 11 }}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  background: "rgba(0,0,0,0.9)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "6px",
                }}
                labelStyle={{ color: "#fff", fontSize: "11px" }}
              />
              <Legend />
              <Bar dataKey="credit" fill="#3b82f6" name="Credit" />
              <Bar dataKey="debit" fill="#ef4444" name="Debit" />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
