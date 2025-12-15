export interface FilterState {
  dateRange: string;
  customStartDate?: string;
  customEndDate?: string;
  timeGranularity: "hour" | "day" | "week" | "month";
  selectedBanks: number[];
  selectedAccounts: string[];
  transactionType: "all" | "income" | "expense" | "transfer";
  minAmount?: number;
  maxAmount?: number;
}

export type PLFilter = "all" | "income" | "expense";

export interface DailyPLData {
  income: number;
  expense: number;
  net: number;
}
