import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import {
  Activity,
  Calendar as CalendarIcon,
  Building2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
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
import { ApiError } from "../ui/api-error";
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
  TransactionCountCard,
  UniqueCounterpartiesCard,
  TopDepositorsCard,
  TopReceiversCard,
} from "./dashboard/components";
import type { PLFilter } from "./dashboard/types";

export default function Accounts() {
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
        console.error("Error loading accounts data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Get accounts and banks
  const accounts = useMemo(() => data?.accounts || [], [data]);
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

  // Select one bank (default first one)
  const [selectedBank, setSelectedBank] = useState<number>(0);

  // Update selectedBank when accounts load
  useEffect(() => {
    if (
      accounts.length > 0 &&
      availableBanks.length > 0 &&
      selectedBank === 0
    ) {
      setSelectedBank(availableBanks[0]);
    }
  }, [accounts, availableBanks, selectedBank]);

  // Get accounts for selected bank
  const bankAccounts = useMemo(() => {
    return accounts.filter((acc) => acc.bank === selectedBank);
  }, [accounts, selectedBank]);

  // Account selection: index in bankAccounts array (0 = total, 1+ = accounts)
  const [selectedAccountIndex, setSelectedAccountIndex] = useState<number>(0);

  // Reset account index when bank changes
  useEffect(() => {
    // Use setTimeout to avoid synchronous setState in effect
    setTimeout(() => setSelectedAccountIndex(0), 0);
  }, [selectedBank]);

  // Get selected account (null if total is selected, otherwise the account)
  const selectedAccount = useMemo(() => {
    if (selectedAccountIndex === 0) return null; // Total card
    return bankAccounts[selectedAccountIndex - 1]?.accountNumber || null;
  }, [selectedAccountIndex, bankAccounts]);

  // Navigation functions
  const handlePrev = () => {
    setSelectedAccountIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setSelectedAccountIndex((prev) => Math.min(bankAccounts.length, prev + 1));
  };

  // State for P&L heatmap filter
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

  // Filter transactions based on selected bank, account, and chart filters
  const filteredTransactions = useMemo(() => {
    if (!data || !data.transactions) return [];
    let filtered = [...data.transactions];

    // Filter by bank
    filtered = filtered.filter(
      (t) => t.bankId !== undefined && t.bankId === selectedBank
    );

    // Filter by account if specific account selected (not total)
    if (selectedAccount !== null) {
      if (bankAccounts.length > 1) {
        // Try to match by accountNumber
        const accountFirst4 = selectedAccount.slice(0, 4);
        const accountLast4 = selectedAccount.slice(-4);
        const accountMiddle4 = selectedAccount.slice(4, 8);

        const matched = filtered.filter((t) => {
          if (!t.accountNumber) return false;
          return (
            t.accountNumber === accountFirst4 ||
            t.accountNumber === accountLast4 ||
            t.accountNumber === accountMiddle4 ||
            selectedAccount.includes(t.accountNumber) ||
            t.accountNumber.includes(accountFirst4) ||
            t.accountNumber.includes(accountLast4)
          );
        });

        if (matched.length > 0) {
          filtered = matched;
        }
      }
    }

    // Apply chart date filter
    const now = new Date();
    let startDate: Date;
    let endDate: Date = new Date();

    if (
      chartDateFilter === "custom" &&
      chartCustomStartDate &&
      chartCustomEndDate
    ) {
      startDate = new Date(chartCustomStartDate);
      endDate = new Date(chartCustomEndDate);
      endDate.setHours(23, 59, 59, 999);
    } else {
      switch (chartDateFilter) {
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

    // Apply chart transaction type filter
    if (chartTransactionTypeFilter === "credit") {
      filtered = filtered.filter((t) => t.type === "CREDIT");
    } else if (chartTransactionTypeFilter === "debit") {
      filtered = filtered.filter((t) => t.type === "DEBIT");
    }

    return filtered;
  }, [
    data,
    selectedBank,
    selectedAccount,
    bankAccounts,
    chartDateFilter,
    chartCustomStartDate,
    chartCustomEndDate,
    chartTransactionTypeFilter,
  ]);

  // Calculate daily P&L for heatmap - use all transactions for the displayed month
  const dailyPLData = useMemo(() => {
    const dailyData: Record<
      string,
      { income: number; expense: number; net: number }
    > = {};

    const transactions = data?.transactions || [];
    if (!transactions.length || !currentMonth) return dailyData;

    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const monthPrefix = `${year}-${String(month + 1).padStart(2, "0")}`;

    transactions
      .filter((t) => {
        if (t.bankId !== selectedBank) return false;
        if (selectedAccount === null) return true; // Show all accounts for bank
        if (!t.accountNumber) return false;
        // Check if transaction accountNumber matches first 4, last 4, or appears in account number
        const accountFirst4 = selectedAccount.slice(0, 4);
        const accountLast4 = selectedAccount.slice(-4);
        return (
          t.accountNumber === accountFirst4 ||
          t.accountNumber === accountLast4 ||
          selectedAccount.includes(t.accountNumber)
        );
      })
      .forEach((t) => {
        if (!t.time) return;
        const dateKey = t.time.split("T")[0];

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
  }, [data, currentMonth, selectedBank, selectedAccount]);

  // Calculate metrics
  const totalBalance = useMemo(() => {
    if (selectedAccount === null) {
      // Total card selected - show sum of all accounts
      return bankAccounts.reduce((sum, acc) => sum + acc.balance, 0);
    }
    // Specific account selected
    const account = bankAccounts.find(
      (acc) => acc.accountNumber === selectedAccount
    );
    return account?.balance || 0;
  }, [bankAccounts, selectedAccount]);

  const monthIncomeExpense = useMemo(() => {
    if (!data?.transactions || !currentMonth) {
      return { income: 0, expense: 0 };
    }

    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const monthPrefix = `${year}-${String(month + 1).padStart(2, "0")}`;

    const monthTransactions = filteredTransactions.filter((t) => {
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
  }, [data, filteredTransactions, currentMonth]);

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

  // Calculate top depositors (creditors for CREDIT transactions)
  const topDepositors = useMemo(() => {
    const depositorMap: Record<string, { amount: number; count: number }> = {};

    filteredTransactions
      .filter((t) => t.type === "CREDIT" && t.creditor)
      .forEach((t) => {
        const creditor = t.creditor!;
        if (!depositorMap[creditor]) {
          depositorMap[creditor] = { amount: 0, count: 0 };
        }
        depositorMap[creditor].amount += t.amount;
        depositorMap[creditor].count += 1;
      });

    return Object.entries(depositorMap)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
  }, [filteredTransactions]);

  // Calculate top receivers (creditors for DEBIT transactions)
  const topReceivers = useMemo(() => {
    const receiverMap: Record<string, { amount: number; count: number }> = {};

    filteredTransactions
      .filter((t) => t.type === "DEBIT" && t.creditor)
      .forEach((t) => {
        const creditor = t.creditor!;
        if (!receiverMap[creditor]) {
          receiverMap[creditor] = { amount: 0, count: 0 };
        }
        receiverMap[creditor].amount += Math.abs(t.amount);
        receiverMap[creditor].count += 1;
      });

    return Object.entries(receiverMap)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
  }, [filteredTransactions]);

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
          <p className="text-muted-foreground">Loading accounts data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <ApiError
        onRetry={() => {
          setError(null);
          setLoading(true);
          Promise.all([fetchDashboardData(), fetchBanks()])
            .then(([dashboardData, banksData]) => {
              setData(dashboardData);
              setBanks(banksData);
            })
            .catch((err) => {
              setError(
                err instanceof Error ? err.message : "Failed to load data"
              );
            })
            .finally(() => {
              setLoading(false);
            });
        }}
      />
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
              <SelectContent side="bottom">
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
              <SelectContent side="bottom">
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="credit">Credit</SelectItem>
                <SelectItem value="debit">Debit</SelectItem>
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
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-foreground mb-2">
                Accounts
              </h1>
              <p className="text-muted-foreground">
                Manage and view details for your connected accounts.
              </p>
            </div>

            {/* Bank Selector */}
            <div className="flex items-center gap-3">
              <Select
                value={selectedBank.toString()}
                onValueChange={(value) => {
                  setSelectedBank(parseInt(value));
                }}
              >
                <SelectTrigger className="w-[180px] border-border/50 bg-background/50 hover:bg-background/80">
                  <Building2 className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Select Bank" />
                </SelectTrigger>
                <SelectContent side="bottom">
                  {availableBanks.map((bankId) => (
                    <SelectItem key={bankId} value={bankId.toString()}>
                      {getBankName(bankId)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Account Cards and P&L Heatmap */}
          {bankAccounts.length > 0 && (
            <div className="mb-8">
              {plViewMode === "daily" ? (
                <div className="flex gap-6 items-start">
                  <div className="flex flex-col gap-4 shrink-0">
                    {/* Card Navigation */}
                    <div className="flex items-center justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePrev}
                        disabled={selectedAccountIndex === 0}
                        className="h-8 w-8 p-0"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <span className="text-xs text-muted-foreground">
                        {selectedAccountIndex === 0
                          ? "Total"
                          : `${selectedAccountIndex} / ${bankAccounts.length}`}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleNext}
                        disabled={selectedAccountIndex >= bankAccounts.length}
                        className="h-8 w-8 p-0"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Account Cards Stack */}
                    <div
                      className="relative"
                      style={{
                        height: `${(bankAccounts.length + 1) * 8 + 200}px`,
                        width: `${320 + bankAccounts.length * 8}px`,
                      }}
                    >
                      {/* Total Balance Card - On Top */}
                      {selectedAccountIndex === 0 && (
                        <div
                          className="absolute"
                          style={{
                            top: "0px",
                            left: "0px",
                            width: "320px",
                            zIndex: bankAccounts.length + 1,
                          }}
                        >
                          <TotalBalanceCard
                            totalBalance={totalBalance}
                            bankCount={1}
                            accountCount={bankAccounts.length}
                            totalCredit={totalIncome}
                            totalDebit={totalExpense}
                          />
                        </div>
                      )}

                      {/* Individual Account Cards */}
                      {bankAccounts.map((account, index) => {
                        const cardIndex = index + 1;
                        if (selectedAccountIndex === cardIndex) {
                          return (
                            <div
                              key={account.accountNumber}
                              className="absolute"
                              style={{
                                top: `0px`,
                                left: `0px`,
                                width: "320px",
                                zIndex: bankAccounts.length - index,
                              }}
                            >
                              <AccountCard
                                id={account.bank}
                                name={account.accountHolderName}
                                balance={account.balance}
                                accountNumber={account.accountNumber}
                              />
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>

                    {/* Income and Expense Cards */}
                    <div className="flex flex-col gap-3 mt-10">
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
                      allTransactions={(filteredTransactions || []).map(
                        (t) => ({
                          time: t.time,
                          type: t.type || "",
                          amount: t.amount,
                        })
                      )}
                      plFilter={plFilter}
                      viewMode={plViewMode}
                      onViewModeChange={setPlViewMode}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex gap-6 items-start">
                  <div className="flex flex-col gap-4 shrink-0">
                    {/* Card Navigation */}
                    <div className="flex items-center justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePrev}
                        disabled={selectedAccountIndex === 0}
                        className="h-8 w-8 p-0"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <span className="text-xs text-muted-foreground">
                        {selectedAccountIndex === 0
                          ? "Total"
                          : `${selectedAccountIndex} / ${bankAccounts.length}`}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleNext}
                        disabled={selectedAccountIndex >= bankAccounts.length}
                        className="h-8 w-8 p-0"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Account Cards Stack */}
                    <div
                      className="relative"
                      style={{
                        height: `${(bankAccounts.length + 1) * 8 + 200}px`,
                        width: `${320 + bankAccounts.length * 8}px`,
                      }}
                    >
                      {/* Total Balance Card - On Top */}
                      {selectedAccountIndex === 0 && (
                        <div
                          className="absolute"
                          style={{
                            top: "0px",
                            left: "0px",
                            width: "320px",
                            zIndex: bankAccounts.length + 1,
                          }}
                        >
                          <TotalBalanceCard
                            totalBalance={totalBalance}
                            bankCount={1}
                            accountCount={bankAccounts.length}
                            totalCredit={totalIncome}
                            totalDebit={totalExpense}
                          />
                        </div>
                      )}

                      {/* Individual Account Cards */}
                      {bankAccounts.map((account, index) => {
                        const cardIndex = index + 1;
                        if (selectedAccountIndex === cardIndex) {
                          return (
                            <div
                              key={account.accountNumber}
                              className="absolute"
                              style={{
                                top: `0px`,
                                left: `0px`,
                                width: "320px",
                                zIndex: bankAccounts.length - index,
                                // transform: `rotate(${cardIndex * -0.2}deg)`,
                              }}
                            >
                              <AccountCard
                                id={account.bank}
                                name={account.accountHolderName}
                                balance={account.balance}
                                accountNumber={account.accountNumber}
                              />
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>

                    {/* Income and Expense Cards */}
                    <div className="flex flex-col gap-3 mt-10">
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
                      allTransactions={(filteredTransactions || []).map(
                        (t) => ({
                          time: t.time,
                          type: t.type || "",
                          amount: t.amount,
                        })
                      )}
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
              <div className="lg:col-span-2">
                <LineBarChart
                  transactions={filteredTransactions}
                  chartType={chartType}
                  onChartTypeChange={setChartType}
                  dateFilter={chartDateFilter}
                  transactionTypeFilter={chartTransactionTypeFilter}
                  selectedBanks={[selectedBank]}
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
                  transactions={filteredTransactions}
                  dateFilter={chartDateFilter}
                  transactionTypeFilter={chartTransactionTypeFilter}
                  selectedBanks={[selectedBank]}
                  customStartDate={
                    chartCustomStartDate?.toISOString().split("T")[0] || ""
                  }
                  customEndDate={
                    chartCustomEndDate?.toISOString().split("T")[0] || ""
                  }
                  getBankName={getBankName}
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
            title="Total Income"
            value={totalIncome.toLocaleString("en-US", {
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
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <TopDepositorsCard topDepositors={topDepositors} />
          <TopReceiversCard topReceivers={topReceivers} />
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
