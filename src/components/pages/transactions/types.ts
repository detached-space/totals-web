export interface TransactionFilters {
  // Date range
  dateRange: "Today" | "WTD" | "MTD" | "QTD" | "YTD" | "Custom" | "All";
  customStartDate?: Date;
  customEndDate?: Date;

  // Bank and account filters
  selectedBanks: number[];
  selectedAccounts: string[];

  // Transaction direction
  direction: "all" | "inflow" | "outflow" | "transfer";

  // Amount range
  minAmount?: number;
  maxAmount?: number;

  // Counterparty
  counterparty?: string;

  // Category and tags
  category?: string;
  tags: string[];

  // Status filters
  status: ("Parsed" | "Manual" | "Unclassified" | "Flagged")[];

  // Technical filters
  minConfidence?: number;
  missingReference: boolean;
  duplicateCandidates: boolean;
  smsSenderId?: string;

  // Search
  searchQuery?: string;
  useRegex: boolean;
}

export interface TransactionTableColumn {
  id: string;
  label: string;
  width: number;
  sticky?: boolean;
  visible: boolean;
  order: number;
}

export interface TransactionTotals {
  totalInflow: number;
  totalOutflow: number;
  netAmount: number;
  transactionCount: number;
}

export type BulkAction =
  | "assign-category"
  | "assign-counterparty"
  | "add-tags"
  | "mark-reviewed"
  | "flag"
  | "export";
