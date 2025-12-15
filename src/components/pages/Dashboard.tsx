import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { Activity, Calendar as CalendarIcon } from "lucide-react";
import type { DashboardData } from "../../lib/types";
import { fetchDashboardData, fetchBanks, type ApiBank } from "../../lib/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { format } from "date-fns";
import AccountCard from "../cards/AccountCard";
import {
  SimpleMetricCard,
  TotalBalanceCard,
  PLHeatmap,
  TotalIncomeCard,
  TotalExpenseCard,
  LineBarChart,
  PieChart,
  MostDebitedBankCard,
  MostCreditedBankCard,
  TransactionCountCard,
  UniqueCounterpartiesCard,
} from "./dashboard/components";
import type { FilterState, PLFilter } from "./dashboard/types";

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [banks, setBanks] = useState<ApiBank[]>([]);

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
        console.error("Error loading dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const [filters] = useState<FilterState>({
    dateRange: "Today",
    timeGranularity: "day",
    selectedBanks: [],
    selectedAccounts: [],
    transactionType: "all",
  });

  // State for P&L heatmap filter (income, expense, or all)
  const [plFilter, setPlFilter] = useState<PLFilter>("all");
  const [plViewMode, setPlViewMode] = useState<"monthly" | "yearly" | "daily">(
    "monthly"
  );

  // State for chart filters
  const [chartType, setChartType] = useState<"line" | "bar">("line");
  const [chartDateFilter, setChartDateFilter] = useState<
    "week" | "month" | "year" | "custom"
  >("month");
  const [chartTransactionTypeFilter, setChartTransactionTypeFilter] = useState<
    "all" | "credit" | "debit"
  >("all");
  const [chartSelectedBanks, setChartSelectedBanks] = useState<number[]>([]);
  const [chartCustomStartDate, setChartCustomStartDate] = useState<
    Date | undefined
  >(undefined);
  const [chartCustomEndDate, setChartCustomEndDate] = useState<
    Date | undefined
  >(undefined);
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [showEndCalendar, setShowEndCalendar] = useState(false);

  // Intersection Observer to detect when charts are in view
  const chartsRef = useRef<HTMLDivElement>(null);
  const [chartsInView, setChartsInView] = useState(false);

  useEffect(() => {
    const element = chartsRef.current;
    if (!element) return;

    const checkVisibility = () => {
      const rect = element.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      // Show filter when charts section is above 50% of viewport
      const visibleAbove50Percent =
        rect.top < viewportHeight * 0.5 && rect.bottom > 0;
      setChartsInView(visibleAbove50Percent);
    };

    // Initial check
    checkVisibility();

    // Use IntersectionObserver for better performance
    const observer = new IntersectionObserver(
      () => {
        checkVisibility();
      },
      {
        threshold: [0, 0.1, 0.5, 1],
        rootMargin: "0px",
      }
    );

    observer.observe(element);

    // Also listen to scroll for more responsive updates
    window.addEventListener("scroll", checkVisibility, { passive: true });
    window.addEventListener("resize", checkVisibility, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", checkVisibility);
      window.removeEventListener("resize", checkVisibility);
    };
  }, [data]); // Re-run when data loads

  // Close calendars when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        !target.closest("[data-calendar-trigger]") &&
        !target.closest("[data-calendar]")
      ) {
        setShowStartCalendar(false);
        setShowEndCalendar(false);
      }
    };

    if (showStartCalendar || showEndCalendar) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [showStartCalendar, showEndCalendar]);

  // Get transactions and accounts safely - always return arrays to maintain hook order
  const accounts = useMemo(() => data?.accounts || [], [data]);

  // Get available banks from accounts
  const availableBanks = useMemo(() => {
    const bankSet = new Set(accounts.map((a) => a.bank));
    return Array.from(bankSet).sort();
  }, [accounts]);

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
    (bankId: number): string => {
      return bankNameMap.get(bankId) || `Bank ${bankId}`;
    },
    [bankNameMap]
  );

  // Filter transactions based on current filters
  const filteredTransactions = useMemo(() => {
    if (!data || !data.transactions) return [];
    let filtered = [...data.transactions];

    // Date range filter
    if (filters.dateRange !== "All") {
      const now = new Date();
      let startDate: Date;
      switch (filters.dateRange) {
        case "Today": {
          startDate = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate()
          );
          break;
        }
        case "Yesterday": {
          startDate = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() - 1
          );
          break;
        }
        case "This Week": {
          const dayOfWeek = now.getDay();
          startDate = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() - dayOfWeek
          );
          break;
        }
        case "This Month": {
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        }
        default:
          startDate = new Date(0);
      }

      if (
        filters.dateRange === "Custom" &&
        filters.customStartDate &&
        filters.customEndDate
      ) {
        startDate = new Date(filters.customStartDate);
        const endDate = new Date(filters.customEndDate);
        filtered = filtered.filter((t) => {
          if (!t.time) return false;
          const tDate = new Date(t.time);
          return tDate >= startDate && tDate <= endDate;
        });
      } else {
        filtered = filtered.filter((t) => {
          if (!t.time) return false;
          return new Date(t.time) >= startDate;
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

    // Transaction type filter
    if (filters.transactionType === "income") {
      filtered = filtered.filter((t) => t.type === "CREDIT");
    } else if (filters.transactionType === "expense") {
      filtered = filtered.filter((t) => t.type === "DEBIT");
    }

    // Amount filter
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

    return filtered;
  }, [data, filters]);

  // Calculate daily P&L for heatmap - use all transactions for the displayed month, not filtered
  // Use currentMonth to prevent flickering during month changes
  const dailyPLData = useMemo(() => {
    const dailyData: Record<
      string,
      { income: number; expense: number; net: number }
    > = {};

    if (!data || !data.transactions || !currentMonth) return dailyData;

    // Build month prefix like "2025-09" for comparison
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const monthPrefix = `${year}-${String(month + 1).padStart(2, "0")}`;

    // Filter transactions by checking if date starts with month prefix
    data.transactions.forEach((t) => {
      if (!t.time) return;
      const dateKey = t.time.split("T")[0]; // "2025-09-01"

      // Check if this transaction belongs to current month
      if (!dateKey.startsWith(monthPrefix)) return;

      if (!dailyData[dateKey]) {
        dailyData[dateKey] = { income: 0, expense: 0, net: 0 };
      }

      if (t.type === "CREDIT") {
        dailyData[dateKey].income += t.amount;
      } else if (t.type === "DEBIT") {
        dailyData[dateKey].expense += Math.abs(t.amount);
      }
      dailyData[dateKey].net =
        dailyData[dateKey].income - dailyData[dateKey].expense;
    });

    return dailyData;
  }, [data, currentMonth]);

  // Calculate KPI metrics from filtered transactions
  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  // Calculate income/expense for the displayed month (matching heatmap)
  // Use currentMonth to prevent flickering when switching months
  const monthIncomeExpense = useMemo(() => {
    if (!data || !data.transactions || !currentMonth) {
      return { income: 0, expense: 0 };
    }

    // Build month prefix like "2025-09" for comparison
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const monthPrefix = `${year}-${String(month + 1).padStart(2, "0")}`;

    // Filter transactions by checking if date starts with month prefix
    const monthTransactions = data.transactions.filter((t) => {
      if (!t.time) return false;
      return t.time.startsWith(monthPrefix);
    });

    const income = monthTransactions
      .filter((t) => t.type === "CREDIT")
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = Math.abs(
      monthTransactions
        .filter((t) => t.type === "DEBIT")
        .reduce((sum, t) => sum + t.amount, 0)
    );

    return { income, expense };
  }, [data, currentMonth]);

  const totalIncome = filteredTransactions
    .filter((t) => t.type === "CREDIT")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = Math.abs(
    filteredTransactions
      .filter((t) => t.type === "DEBIT")
      .reduce((sum, t) => sum + t.amount, 0)
  );
  const netPL = totalIncome - totalExpense;
  const transactionVolume = filteredTransactions.length;
  const avgTransactionValue =
    transactionVolume > 0
      ? filteredTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0) /
        transactionVolume
      : 0;

  // Calculate most debited bank
  const mostDebitedBank = useMemo(() => {
    const bankDebits: Record<number, { total: number; count: number }> = {};

    filteredTransactions
      .filter((t) => t.type === "DEBIT" && t.bankId !== undefined)
      .forEach((t) => {
        const bankId = t.bankId!;
        if (!bankDebits[bankId]) {
          bankDebits[bankId] = { total: 0, count: 0 };
        }
        bankDebits[bankId].total += Math.abs(t.amount);
        bankDebits[bankId].count += 1;
      });

    const entries = Object.entries(bankDebits);
    if (entries.length === 0) return null;

    const [bankIdStr, data] = entries.reduce((max, [id, d]) =>
      d.total > max[1].total ? [id, d] : max
    );

    const totalDebitAmount = filteredTransactions
      .filter((t) => t.type === "DEBIT")
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    return {
      bankId: parseInt(bankIdStr),
      totalDebit: data.total,
      transactionCount: data.count,
      percentage:
        totalDebitAmount > 0 ? (data.total / totalDebitAmount) * 100 : 0,
    };
  }, [filteredTransactions]);

  // Calculate most credited bank
  const mostCreditedBank = useMemo(() => {
    const bankCredits: Record<number, { total: number; count: number }> = {};

    filteredTransactions
      .filter((t) => t.type === "CREDIT" && t.bankId !== undefined)
      .forEach((t) => {
        const bankId = t.bankId!;
        if (!bankCredits[bankId]) {
          bankCredits[bankId] = { total: 0, count: 0 };
        }
        bankCredits[bankId].total += t.amount;
        bankCredits[bankId].count += 1;
      });

    const entries = Object.entries(bankCredits);
    if (entries.length === 0) return null;

    const [bankIdStr, data] = entries.reduce((max, [id, d]) =>
      d.total > max[1].total ? [id, d] : max
    );

    return {
      bankId: parseInt(bankIdStr),
      totalCredit: data.total,
      transactionCount: data.count,
      percentage: totalIncome > 0 ? (data.total / totalIncome) * 100 : 0,
    };
  }, [filteredTransactions, totalIncome]);

  // Calculate unique counterparties
  const uniqueCounterparties = useMemo(() => {
    const uniqueReceivers = new Set<string>();
    const uniqueSenders = new Set<string>();

    filteredTransactions.forEach((t) => {
      if (t.creditor) {
        if (t.type === "DEBIT") {
          uniqueReceivers.add(t.creditor);
        } else if (t.type === "CREDIT") {
          uniqueSenders.add(t.creditor);
        }
      }
      if (t.receiver) {
        uniqueReceivers.add(t.receiver);
      }
    });

    const totalUnique = new Set([...uniqueReceivers, ...uniqueSenders]).size;

    return {
      uniqueReceivers: uniqueReceivers.size,
      uniqueSenders: uniqueSenders.size,
      totalUnique,
    };
  }, [filteredTransactions]);

  // Early return after all hooks
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Activity
            className="animate-spin mx-auto mb-4 text-muted-foreground"
            size={32}
          />
          <p className="text-muted-foreground">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
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
    <div className="min-h-screen bg-background relative">
      <div className="max-w-[1600px] mx-auto px-8 py-6">
        {/* Fixed Filters at Top Right - Visible when charts are above 50% of screen */}
        <div
          className={`fixed top-6 right-6 z-50 transition-all duration-300 ${
            chartsInView
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 -translate-y-2 pointer-events-none"
          }`}
        >
          <div className="flex items-center gap-3 bg-white/10 dark:bg-black/20 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-xl px-4 py-2.5 shadow-2xl shadow-black/20 ring-1 ring-white/10 dark:ring-white/5">
            <Select
              value={chartDateFilter}
              onValueChange={(value) =>
                setChartDateFilter(
                  value as "week" | "month" | "year" | "custom"
                )
              }
            >
              <SelectTrigger className="w-[120px] h-8 text-xs border-border/50 bg-background/50 hover:bg-background/80 transition-all">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Week</SelectItem>
                <SelectItem value="month">Month</SelectItem>
                <SelectItem value="year">Year</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={chartTransactionTypeFilter}
              onValueChange={(value) =>
                setChartTransactionTypeFilter(
                  value as "all" | "credit" | "debit"
                )
              }
            >
              <SelectTrigger className="w-[120px] h-8 text-xs border-border/50 bg-background/50 hover:bg-background/80 transition-all">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="credit">Credit</SelectItem>
                <SelectItem value="debit">Debit</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={
                chartSelectedBanks.length === 0
                  ? "all"
                  : chartSelectedBanks.length === availableBanks.length
                  ? "all"
                  : chartSelectedBanks.length === 1
                  ? `bank-${chartSelectedBanks[0]}`
                  : "selected"
              }
              onValueChange={(value) => {
                if (value === "all") {
                  setChartSelectedBanks([]);
                } else if (value.startsWith("bank-")) {
                  const bankId = parseInt(value.replace("bank-", ""));
                  if (chartSelectedBanks.includes(bankId)) {
                    setChartSelectedBanks(
                      chartSelectedBanks.filter((b) => b !== bankId)
                    );
                  } else {
                    setChartSelectedBanks([...chartSelectedBanks, bankId]);
                  }
                }
              }}
            >
              <SelectTrigger className="w-[140px] h-8 text-xs border-white/20 dark:border-white/10 bg-white/10 dark:bg-white/5 hover:bg-white/20 dark:hover:bg-white/10 transition-all backdrop-blur-sm">
                <SelectValue
                  placeholder={
                    chartSelectedBanks.length === 0
                      ? "All banks"
                      : `${chartSelectedBanks.length} bank(s)`
                  }
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All banks</SelectItem>
                {availableBanks.map((bankId) => (
                  <SelectItem key={bankId} value={`bank-${bankId}`}>
                    {chartSelectedBanks.includes(bankId) && "✓ "}
                    {getBankName(bankId)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {chartDateFilter === "custom" && (
              <div className="flex gap-2 relative">
                <div className="relative">
                  <Button
                    variant="outline"
                    size="sm"
                    data-calendar-trigger
                    onClick={() => {
                      setShowStartCalendar(!showStartCalendar);
                      setShowEndCalendar(false);
                    }}
                    className="h-8 px-3 text-xs border-white/20 dark:border-white/10 bg-white/10 dark:bg-white/5 hover:bg-white/20 dark:hover:bg-white/10 backdrop-blur-sm"
                  >
                    <CalendarIcon className="mr-2 h-3 w-3" />
                    {chartCustomStartDate
                      ? format(chartCustomStartDate, "MMM dd, yyyy")
                      : "Start date"}
                  </Button>
                  {showStartCalendar && (
                    <div
                      data-calendar
                      className="absolute top-full mt-1 left-0 z-50 bg-popover border border-border rounded-lg shadow-lg"
                    >
                      <Calendar
                        mode="single"
                        selected={chartCustomStartDate}
                        onSelect={(date) => {
                          setChartCustomStartDate(date);
                          setShowStartCalendar(false);
                        }}
                        className="rounded-lg"
                      />
                    </div>
                  )}
                </div>
                <div className="relative">
                  <Button
                    variant="outline"
                    size="sm"
                    data-calendar-trigger
                    onClick={() => {
                      setShowEndCalendar(!showEndCalendar);
                      setShowStartCalendar(false);
                    }}
                    className="h-8 px-3 text-xs border-white/20 dark:border-white/10 bg-white/10 dark:bg-white/5 hover:bg-white/20 dark:hover:bg-white/10 backdrop-blur-sm"
                  >
                    <CalendarIcon className="mr-2 h-3 w-3" />
                    {chartCustomEndDate
                      ? format(chartCustomEndDate, "MMM dd, yyyy")
                      : "End date"}
                  </Button>
                  {showEndCalendar && (
                    <div
                      data-calendar
                      className="absolute top-full mt-1 right-0 z-50 bg-popover border border-border rounded-lg shadow-lg"
                    >
                      <Calendar
                        mode="single"
                        selected={chartCustomEndDate}
                        onSelect={(date) => {
                          setChartCustomEndDate(date);
                          setShowEndCalendar(false);
                        }}
                        className="rounded-lg"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-foreground mb-6">
            Dashboard
          </h1>

          {/* Stacked Accounts with Total Balance on Top and P&L Heatmap */}
          {accounts.length > 0 && (
            <div className="mb-8">
              {plViewMode === "daily" ? (
                <>
                  {/* Income and Expense Cards - Moved Up */}
                  <div className="flex gap-4 mb-6">
                    <div className="flex-1">
                      <TotalIncomeCard
                        totalIncome={monthIncomeExpense.income}
                        isSelected={plFilter === "income"}
                        onClick={() =>
                          setPlFilter(plFilter === "income" ? "all" : "income")
                        }
                      />
                    </div>
                    <div className="flex-1">
                      <TotalExpenseCard
                        totalExpense={monthIncomeExpense.expense}
                        isSelected={plFilter === "expense"}
                        onClick={() =>
                          setPlFilter(
                            plFilter === "expense" ? "all" : "expense"
                          )
                        }
                      />
                    </div>
                  </div>

                  {/* P&L Heatmap - Full Width Below */}
                  <PLHeatmap
                    currentMonth={currentMonth}
                    setCurrentMonth={setCurrentMonth}
                    dailyPLData={dailyPLData}
                    allTransactions={(data?.transactions || []).map((t) => ({
                      time: t.time,
                      type: t.type || "",
                      amount: t.amount,
                    }))}
                    plFilter={plFilter}
                    viewMode={plViewMode}
                    onViewModeChange={setPlViewMode}
                  />
                </>
              ) : (
                <div className="flex gap-6 items-start">
                  {/* Card Stack and Totals */}
                  <div className="flex flex-col gap-4 shrink-0">
                    {/* Card Stack */}
                    <div
                      className="relative"
                      style={{
                        height: `${(accounts.length + 1) * 8 + 200}px`,
                        width: `${320 + accounts.length * 8}px`,
                      }}
                    >
                      {/* Total Balance Card - On Top */}
                      <div
                        className="absolute"
                        style={{
                          top: "7px",
                          left: "0px",
                          width: "320px",
                          zIndex: accounts.length + 1,
                        }}
                      >
                        <TotalBalanceCard
                          totalBalance={totalBalance}
                          bankCount={new Set(accounts.map((a) => a.bank)).size}
                          accountCount={accounts.length}
                          totalCredit={totalIncome}
                          totalDebit={totalExpense}
                        />
                      </div>
                      {/* Individual Account Cards */}
                      {accounts.map((account, index) => (
                        <div
                          key={account.accountNumber}
                          className="absolute"
                          style={{
                            top: `${(index + 1) * 7}px`,
                            left: `${(index + 1) * 8}px`,
                            width: "320px",
                            zIndex: accounts.length - index,
                            transform: `rotate(${(index + 1) * -0.2}deg)`,
                          }}
                        >
                          <AccountCard
                            id={account.bank}
                            name={account.accountHolderName}
                            balance={account.balance}
                            accountNumber={account.accountNumber}
                          />
                        </div>
                      ))}
                    </div>

                    {/* Income and Expense Cards */}
                    <div className="flex flex-col gap-3 mt-12">
                      <TotalIncomeCard
                        totalIncome={monthIncomeExpense.income}
                        isSelected={plFilter === "income"}
                        onClick={() =>
                          setPlFilter(plFilter === "income" ? "all" : "income")
                        }
                      />
                      <TotalExpenseCard
                        totalExpense={monthIncomeExpense.expense}
                        isSelected={plFilter === "expense"}
                        onClick={() =>
                          setPlFilter(
                            plFilter === "expense" ? "all" : "expense"
                          )
                        }
                      />
                    </div>
                  </div>

                  {/* P&L Heatmap */}
                  <div className="flex-1 min-w-0">
                    <PLHeatmap
                      currentMonth={currentMonth}
                      setCurrentMonth={setCurrentMonth}
                      dailyPLData={dailyPLData}
                      allTransactions={(data?.transactions || []).map((t) => ({
                        time: t.time,
                        type: t.type || "",
                        amount: t.amount,
                      }))}
                      plFilter={plFilter}
                      viewMode={plViewMode}
                      onViewModeChange={setPlViewMode}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Charts Section */}
          <div ref={chartsRef} className="mb-8">
            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
              <div className="lg:col-span-2">
                <LineBarChart
                  transactions={data?.transactions || []}
                  chartType={chartType}
                  onChartTypeChange={setChartType}
                  dateFilter={chartDateFilter}
                  transactionTypeFilter={chartTransactionTypeFilter}
                  selectedBanks={chartSelectedBanks}
                  customStartDate={
                    chartCustomStartDate?.toISOString().split("T")[0] || ""
                  }
                  customEndDate={
                    chartCustomEndDate?.toISOString().split("T")[0] || ""
                  }
                />
              </div>
              <div className="lg:col-span-1">
                <PieChart
                  transactions={data?.transactions || []}
                  dateFilter={chartDateFilter}
                  transactionTypeFilter={chartTransactionTypeFilter}
                  selectedBanks={chartSelectedBanks}
                  customStartDate={
                    chartCustomStartDate?.toISOString().split("T")[0] || ""
                  }
                  customEndDate={
                    chartCustomEndDate?.toISOString().split("T")[0] || ""
                  }
                />
              </div>
            </div>
          </div>
        </div>
        {/* Secondary Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <SimpleMetricCard
            title="Total Balance"
            value={totalBalance.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
            unit="ETB"
          />
          <SimpleMetricCard
            title="Total Expense"
            value={totalExpense.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
            unit="ETB"
          />
          <SimpleMetricCard
            title="Net P&L"
            value={`${netPL >= 0 ? "+" : ""}${netPL.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`}
            unit="ETB"
          />
          <SimpleMetricCard
            title="Avg Transaction"
            value={avgTransactionValue.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
            unit="ETB"
          />
        </div>

        {/* New Interactive KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {mostDebitedBank ? (
            <MostDebitedBankCard
              bankId={mostDebitedBank.bankId}
              totalDebit={mostDebitedBank.totalDebit}
              transactionCount={mostDebitedBank.transactionCount}
              percentage={mostDebitedBank.percentage}
              getBankName={getBankName}
            />
          ) : (
            <MostDebitedBankCard
              bankId={null}
              totalDebit={0}
              transactionCount={0}
              percentage={0}
              getBankName={getBankName}
            />
          )}

          {mostCreditedBank ? (
            <MostCreditedBankCard
              bankId={mostCreditedBank.bankId}
              totalCredit={mostCreditedBank.totalCredit}
              transactionCount={mostCreditedBank.transactionCount}
              percentage={mostCreditedBank.percentage}
              getBankName={getBankName}
            />
          ) : (
            <MostCreditedBankCard
              bankId={null}
              totalCredit={0}
              transactionCount={0}
              percentage={0}
              getBankName={getBankName}
            />
          )}

          <TransactionCountCard count={transactionVolume} />

          <UniqueCounterpartiesCard
            uniqueReceivers={uniqueCounterparties.uniqueReceivers}
            uniqueSenders={uniqueCounterparties.uniqueSenders}
            totalUnique={uniqueCounterparties.totalUnique}
          />
        </div>
      </div>
    </div>
  );
}
