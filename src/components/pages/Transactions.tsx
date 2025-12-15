import { useState, useMemo, useCallback, useEffect } from "react";
import { Download, Settings2, Activity } from "lucide-react";
import type { Transaction, Account, DashboardData } from "../../lib/types";
import { fetchDashboardData, fetchBanks, type ApiBank } from "../../lib/api";
import { TransactionFiltersPanel } from "./transactions/TransactionFilters";
import { TransactionTable } from "./transactions/TransactionTable";
import { TransactionDetailDrawer } from "./transactions/TransactionDetailDrawer";
import { TransactionTotalsBar } from "./transactions/TransactionTotalsBar";
import { SearchBar } from "./transactions/SearchBar";
import { BulkActions } from "./transactions/BulkActions";
import type {
  TransactionFilters,
  TransactionTableColumn,
} from "./transactions/types";
import { Button } from "../ui/button";

// Default table columns configuration - compact widths
const DEFAULT_COLUMNS: TransactionTableColumn[] = [
  {
    id: "date",
    label: "Date",
    width: 110,
    sticky: true,
    visible: true,
    order: 1,
  },
  { id: "direction", label: "Dir", width: 60, visible: true, order: 2 },
  {
    id: "amount",
    label: "Amount",
    width: 100,
    sticky: true,
    visible: true,
    order: 3,
  },
  { id: "currency", label: "Cur", width: 50, visible: false, order: 4 },
  { id: "bank", label: "Bank", width: 60, visible: true, order: 5 },
  { id: "account", label: "Account", width: 80, visible: true, order: 6 },
  {
    id: "counterparty",
    label: "Counterparty",
    width: 120,
    visible: true,
    order: 7,
  },
  { id: "reference", label: "Reference", width: 140, visible: true, order: 8 },
  { id: "category", label: "Category", width: 100, visible: true, order: 9 },
  { id: "status", label: "Status", width: 80, visible: true, order: 10 },
  { id: "notes", label: "Notes", width: 120, visible: false, order: 11 },
];

export default function Transactions() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [banks, setBanks] = useState<ApiBank[]>([]);
  const [filters, setFilters] = useState<TransactionFilters>({
    dateRange: "All",
    selectedBanks: [],
    selectedAccounts: [],
    direction: "all",
    tags: [],
    status: [],
    missingReference: false,
    duplicateCandidates: false,
    useRegex: false,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [columns] = useState<TransactionTableColumn[]>(DEFAULT_COLUMNS);
  const [sortColumn, setSortColumn] = useState<string>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Fetch data on mount
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        const [dashboardData, banksData] = await Promise.all([
          fetchDashboardData(),
          fetchBanks(),
        ]);
        setData(dashboardData);
        setBanks(banksData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
        console.error("Error loading transactions data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Create bank name mapping
  const bankNameMap = useMemo(() => {
    const map = new Map<number, string>();
    banks.forEach((bank) => {
      map.set(bank.id, bank.shortName || bank.name);
    });
    return map;
  }, [banks]);

  // Helper to get bank name
  const getBankName = useCallback(
    (bankId?: number): string => {
      if (!bankId) return "N/A";
      return bankNameMap.get(bankId) || `Bank ${bankId}`;
    },
    [bankNameMap]
  );

  // Generate IDs for transactions that don't have them
  const transactionsWithIds = useMemo(() => {
    if (!data?.transactions) return [];
    return (data.transactions || []).map((t, idx) => ({
      ...t,
      id: t.id || `txn-${idx}`,
      currency: t.currency || "ETB",
    }));
  }, [data?.transactions]);

  // Get available banks and accounts
  const availableBanks = useMemo(() => {
    const bankSet = new Set(
      transactionsWithIds.map((t) => t.bankId).filter(Boolean)
    );
    return Array.from(bankSet).sort() as number[];
  }, [transactionsWithIds]);

  const accounts = useMemo(() => {
    return (data?.accounts || []) as Account[];
  }, [data?.accounts]);

  const availableCategories = useMemo(() => {
    const cats = new Set<string>();
    transactionsWithIds.forEach((t) => {
      if (t.category) cats.add(t.category);
    });
    return Array.from(cats).sort();
  }, [transactionsWithIds]);

  const availableTags = useMemo(() => {
    const tags = new Set<string>();
    transactionsWithIds.forEach((t) => {
      if (t.tags) t.tags.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [transactionsWithIds]);

  // Apply filters and search
  const filteredTransactions = useMemo(() => {
    let filtered = [...transactionsWithIds];

    // Date range filter
    if (filters.dateRange !== "All") {
      const now = new Date();
      let startDate: Date | null = null;
      let endDate: Date | null = null;

      switch (filters.dateRange) {
        case "Today": {
          startDate = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate()
          );
          endDate = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            23,
            59,
            59
          );
          break;
        }
        case "WTD": {
          const dayOfWeek = now.getDay();
          startDate = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() - dayOfWeek
          );
          endDate = now;
          break;
        }
        case "MTD": {
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          endDate = now;
          break;
        }
        case "QTD": {
          const quarter = Math.floor(now.getMonth() / 3);
          startDate = new Date(now.getFullYear(), quarter * 3, 1);
          endDate = now;
          break;
        }
        case "YTD": {
          startDate = new Date(now.getFullYear(), 0, 1);
          endDate = now;
          break;
        }
        case "Custom": {
          if (filters.customStartDate) startDate = filters.customStartDate;
          if (filters.customEndDate) {
            endDate = new Date(filters.customEndDate);
            endDate.setHours(23, 59, 59, 999);
          }
          break;
        }
      }

      if (startDate || endDate) {
        filtered = filtered.filter((t) => {
          if (!t.time) return false;
          const tDate = new Date(t.time);
          if (startDate && tDate < startDate) return false;
          if (endDate && tDate > endDate) return false;
          return true;
        });
      }
    }

    // Bank filter
    if (filters.selectedBanks.length > 0) {
      filtered = filtered.filter(
        (t) => t.bankId && filters.selectedBanks.includes(t.bankId)
      );
    }

    // Account filter
    if (filters.selectedAccounts.length > 0) {
      filtered = filtered.filter(
        (t) =>
          t.accountNumber && filters.selectedAccounts.includes(t.accountNumber)
      );
    }

    // Direction filter
    if (filters.direction !== "all") {
      filtered = filtered.filter((t) => {
        if (filters.direction === "inflow") {
          return t.type === "CREDIT" || t.amount > 0;
        }
        if (filters.direction === "outflow") {
          return t.type === "DEBIT" || t.amount < 0;
        }
        // transfer logic would go here
        return false;
      });
    }

    // Amount range
    if (filters.minAmount !== undefined) {
      filtered = filtered.filter(
        (t) => Math.abs(t.amount) >= filters.minAmount!
      );
    }
    if (filters.maxAmount !== undefined) {
      filtered = filtered.filter(
        (t) => Math.abs(t.amount) <= filters.maxAmount!
      );
    }

    // Counterparty filter
    if (filters.counterparty) {
      const query = filters.counterparty.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.counterparty?.toLowerCase().includes(query) ||
          t.creditor?.toLowerCase().includes(query) ||
          t.receiver?.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (filters.category) {
      filtered = filtered.filter((t) => t.category === filters.category);
    }

    // Tags filter
    if (filters.tags.length > 0) {
      filtered = filtered.filter((t) =>
        t.tags?.some((tag) => filters.tags.includes(tag))
      );
    }

    // Status filter
    if (filters.status.length > 0) {
      filtered = filtered.filter((t) => {
        if (
          filters.status.includes("Parsed") &&
          t.parsingConfidence !== undefined
        )
          return true;
        if (
          filters.status.includes("Manual") &&
          t.parsingConfidence === undefined
        )
          return true;
        if (filters.status.includes("Unclassified") && !t.category) return true;
        if (filters.status.includes("Flagged") && t.isFlagged) return true;
        return false;
      });
    }

    // Technical filters
    if (filters.minConfidence !== undefined) {
      filtered = filtered.filter(
        (t) => (t.parsingConfidence || 0) >= filters.minConfidence!
      );
    }
    if (filters.missingReference) {
      filtered = filtered.filter(
        (t) => !t.reference || t.reference.trim() === ""
      );
    }
    if (filters.duplicateCandidates) {
      filtered = filtered.filter((t) => t.isDuplicate === true);
    }
    if (filters.smsSenderId) {
      filtered = filtered.filter((t) => t.smsSenderId === filters.smsSenderId);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (filters.useRegex) {
        try {
          const regex = new RegExp(query, "i");
          filtered = filtered.filter(
            (t) =>
              regex.test(t.reference) ||
              regex.test(t.creditor || "") ||
              regex.test(t.counterparty || "") ||
              regex.test(String(t.amount)) ||
              regex.test(t.accountNumber || "")
          );
        } catch {
          // Invalid regex, fall back to simple search
        }
      } else {
        filtered = filtered.filter(
          (t) =>
            t.reference?.toLowerCase().includes(query) ||
            t.creditor?.toLowerCase().includes(query) ||
            t.counterparty?.toLowerCase().includes(query) ||
            String(t.amount).includes(query) ||
            t.accountNumber?.includes(query)
        );
      }
    }

    return filtered;
  }, [transactionsWithIds, filters, searchQuery]);

  const selectedTransactions = useMemo(() => {
    return filteredTransactions.filter((t) => selectedIds.has(t.id || ""));
  }, [filteredTransactions, selectedIds]);

  const handleRowClick = useCallback((transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setDrawerOpen(true);
  }, []);

  const handleCellEdit = useCallback(
    (transactionId: string, field: string, value: string) => {
      // In a real app, this would make an API call
      console.log("Edit transaction", transactionId, field, value);
    },
    []
  );

  const handleSortChange = useCallback(
    (column: string, direction: "asc" | "desc") => {
      setSortColumn(column);
      setSortDirection(direction);
    },
    []
  );

  const handleBulkCategory = useCallback(
    (category: string) => {
      selectedIds.forEach((id) => {
        handleCellEdit(id, "category", category);
      });
    },
    [selectedIds, handleCellEdit]
  );

  const handleBulkCounterparty = useCallback(
    (counterparty: string) => {
      selectedIds.forEach((id) => {
        handleCellEdit(id, "counterparty", counterparty);
      });
    },
    [selectedIds, handleCellEdit]
  );

  const handleBulkTags = useCallback(
    (tags: string[]) => {
      selectedIds.forEach((id) => {
        handleCellEdit(id, "tags", tags.join(","));
      });
    },
    [selectedIds, handleCellEdit]
  );

  const handleBulkReviewed = useCallback(() => {
    selectedIds.forEach((id) => {
      handleCellEdit(id, "isReviewed", "true");
    });
  }, [selectedIds, handleCellEdit]);

  const handleBulkFlag = useCallback(() => {
    selectedIds.forEach((id) => {
      handleCellEdit(id, "isFlagged", "true");
    });
  }, [selectedIds, handleCellEdit]);

  const handleExport = useCallback(() => {
    const csv = [
      [
        "Date",
        "Amount",
        "Currency",
        "Bank",
        "Account",
        "Counterparty",
        "Reference",
        "Category",
        "Status",
      ].join(","),
      ...selectedTransactions.map((t) =>
        [
          t.time || "",
          t.amount,
          t.currency || "ETB",
          `Bank ${t.bankId || ""}`,
          t.accountNumber || "",
          t.counterparty || t.creditor || "",
          t.reference || "",
          t.category || "",
          t.status || "",
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transactions-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [selectedTransactions]);

  if (loading) {
    return (
      <div className="h-[96vh] flex items-center justify-center bg-[var(--color-background)]">
        <div className="text-center">
          <Activity
            className="animate-spin mx-auto mb-4 text-muted-foreground"
            size={32}
          />
          <p className="text-muted-foreground">Loading transactions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[96vh] flex items-center justify-center bg-[var(--color-background)]">
        <div className="text-center">
          <p className="text-destructive mb-4">Error: {error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="h-[96vh] flex flex-col bg-[var(--color-background)] overflow-hidden ">
      {/* Header */}
      <div className="bg-[var(--color-background)] px-4 py-2 sticky top-0 z-30">
        <h1 className="text-xl font-bold text-[var(--color-foreground)]">
          Transactions
        </h1>
      </div>

      {/* Search Bar */}
      <div className="border-b border-[var(--color-card-border)] px-4 py-2 bg-[var(--color-background)] flex items-center justify-between gap-4">
        <div className="flex-1">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            useRegex={filters.useRegex}
            onRegexToggle={(useRegex) => setFilters({ ...filters, useRegex })}
          />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="outline" size="sm" className="h-7 px-2">
            <Settings2 size={14} className="mr-1" />
            <span className="text-xs">Columns</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="h-7 px-2"
          >
            <Download size={14} className="mr-1" />
            <span className="text-xs">Export</span>
          </Button>
        </div>
      </div>

      {/* Bulk Actions */}
      <BulkActions
        selectedCount={selectedIds.size}
        onAssignCategory={handleBulkCategory}
        onAssignCounterparty={handleBulkCounterparty}
        onAddTags={handleBulkTags}
        onMarkReviewed={handleBulkReviewed}
        onFlag={handleBulkFlag}
        onExport={handleExport}
        availableCategories={availableCategories}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden min-w-0">
        {/* Filter Panel */}
        <div className="shrink-0">
          <TransactionFiltersPanel
            filters={filters}
            onFiltersChange={setFilters}
            accounts={accounts}
            availableBanks={availableBanks}
            availableCategories={availableCategories}
            availableTags={availableTags}
            getBankName={getBankName}
          />
        </div>

        {/* Table Area */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          <TransactionTable
            transactions={filteredTransactions}
            columns={columns}
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
            onRowClick={handleRowClick}
            onCellEdit={handleCellEdit}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            onSortChange={handleSortChange}
            getBankName={getBankName}
          />
        </div>
      </div>

      {/* Totals Bar */}
      <div className="shrink-0">
        <TransactionTotalsBar
          transactions={filteredTransactions}
          selectedTransactions={selectedTransactions}
        />
      </div>

      {/* Detail Drawer */}
      <TransactionDetailDrawer
        transaction={selectedTransaction}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        getBankName={getBankName}
      />
    </div>
  );
}
