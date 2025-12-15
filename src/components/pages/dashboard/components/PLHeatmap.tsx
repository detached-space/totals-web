import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../ui/select";
import type { PLFilter, DailyPLData } from "../types";

export interface PLHeatmapProps {
  currentMonth: Date;
  setCurrentMonth: (date: Date) => void;
  dailyPLData: Record<string, DailyPLData>;
  allTransactions?: Array<{ time?: string; type: string; amount: number }>;
  plFilter?: PLFilter;
  viewMode: "monthly" | "yearly" | "daily";
  onViewModeChange?: (mode: "monthly" | "yearly" | "daily") => void;
}

export function PLHeatmap({
  currentMonth,
  setCurrentMonth,
  dailyPLData,
  allTransactions = [],
  plFilter = "all",
  viewMode: controlledViewMode = "monthly",
  onViewModeChange,
}: PLHeatmapProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Always use controlled viewMode (defaults to "monthly" if not provided)
  const viewMode = controlledViewMode;

  const handleViewModeChange = (mode: "monthly" | "yearly" | "daily") => {
    onViewModeChange?.(mode);
  };

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  // Get first day of month and number of days
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  // Adjust starting day (Monday = 0)
  const adjustedStartDay = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1;

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: adjustedStartDay }, (_, i) => i);

  const navigateMonth = (direction: "prev" | "next") => {
    if (viewMode === "yearly") {
      setCurrentMonth(
        new Date(year + (direction === "next" ? 1 : -1), month, 1)
      );
    } else {
      setCurrentMonth(
        new Date(year, month + (direction === "next" ? 1 : -1), 1)
      );
    }
  };

  const formatAmount = (amount: number) => {
    const absAmount = Math.abs(amount);
    if (absAmount >= 1000) {
      return `${amount >= 0 ? "+" : "-"}${(absAmount / 1000).toFixed(1)}k`;
    }
    return `${amount >= 0 ? "+" : ""}${amount.toFixed(1)}`;
  };

  // Calculate monthly P&L data for yearly view
  const monthlyPLData = useMemo(() => {
    if (viewMode === "monthly") return {};

    const monthlyData: Record<string, DailyPLData> = {};
    const targetYear = currentMonth.getFullYear();

    allTransactions.forEach((t) => {
      if (!t.time) return;
      const date = new Date(t.time);
      if (date.getFullYear() !== targetYear) return;

      const monthKey = `${targetYear}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}`;

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { income: 0, expense: 0, net: 0 };
      }

      if (t.type === "CREDIT") {
        monthlyData[monthKey].income += t.amount;
      } else if (t.type === "DEBIT") {
        monthlyData[monthKey].expense += Math.abs(t.amount);
      }
      monthlyData[monthKey].net =
        monthlyData[monthKey].income - monthlyData[monthKey].expense;
    });

    return monthlyData;
  }, [allTransactions, currentMonth, viewMode]);

  // Calculate daily P&L data for entire year (GitHub-style)
  const yearlyDailyPLData = useMemo(() => {
    if (viewMode !== "daily") return {};

    const dailyData: Record<string, DailyPLData> = {};
    const targetYear = currentMonth.getFullYear();

    allTransactions.forEach((t) => {
      if (!t.time) return;
      const date = new Date(t.time);
      if (date.getFullYear() !== targetYear) return;

      const dateKey = t.time.split("T")[0]; // "YYYY-MM-DD"

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
  }, [allTransactions, currentMonth, viewMode]);

  // Filter and transform data based on plFilter
  const filteredPLData = useMemo(() => {
    let sourceData: Record<string, DailyPLData>;
    if (viewMode === "yearly") {
      sourceData = monthlyPLData;
    } else if (viewMode === "daily") {
      sourceData = yearlyDailyPLData;
    } else {
      sourceData = dailyPLData;
    }

    if (plFilter === "all") {
      return sourceData;
    }

    const filtered: Record<string, DailyPLData> = {};

    Object.entries(sourceData).forEach(([dateKey, data]) => {
      if (plFilter === "income") {
        filtered[dateKey] = {
          income: data.income,
          expense: 0,
          net: data.income,
        };
      } else if (plFilter === "expense") {
        filtered[dateKey] = {
          income: 0,
          expense: data.expense,
          net: -data.expense,
        };
      }
    });

    return filtered;
  }, [dailyPLData, monthlyPLData, yearlyDailyPLData, plFilter, viewMode]);

  const getIntensity = (net: number) => {
    const absNet = Math.abs(net);
    if (absNet === 0) return 0;
    const max = Math.max(
      ...Object.values(filteredPLData).map((d) => Math.abs(d.net)),
      1
    );
    return Math.min(absNet / max, 1);
  };

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return (
    <div className="border rounded-lg p-6 bg-card w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigateMonth("prev")}
            className="p-1 hover:bg-accent rounded transition-colors"
          >
            <ChevronLeft size={18} className="text-muted-foreground" />
          </button>
          <h3 className="text-sm font-semibold text-foreground">
            {viewMode === "yearly" || viewMode === "daily"
              ? year.toString()
              : currentMonth.toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
          </h3>
          <button
            onClick={() => navigateMonth("next")}
            className="p-1 hover:bg-accent rounded transition-colors"
          >
            <ChevronRight size={18} className="text-muted-foreground" />
          </button>
        </div>
        <div className="flex items-center gap-3">
          <Select
            value={viewMode}
            onValueChange={(v: string) =>
              handleViewModeChange(v as "monthly" | "yearly" | "daily")
            }
          >
            <SelectTrigger className="w-[100px] h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
              <SelectItem value="daily">Daily</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center gap-4 text-xs">
            {plFilter === "all" ? (
              <>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-blue-500/80" />
                  <span className="text-muted-foreground">Profit</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-red-500/80" />
                  <span className="text-muted-foreground">Loss</span>
                </div>
              </>
            ) : plFilter === "income" ? (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-blue-500/80" />
                <span className="text-muted-foreground">Income</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-red-500/80" />
                <span className="text-muted-foreground">Expense</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {viewMode === "daily" ? (
        <div className="overflow-x-auto">
          <div className="relative flex gap-1 mb-2 min-h-[14px]">
            {/* Month labels */}
            <div className="w-12 shrink-0" />
            {(() => {
              const firstDayOfYear = new Date(year, 0, 1);
              const startDayOfWeek = firstDayOfYear.getDay();
              // Adjust to Monday = 0 (Sunday = 6)
              const adjustedStartDay =
                startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

              return monthNames.map((monthName, idx) => {
                const firstDayOfMonth = new Date(year, idx, 1);
                const daysDiff = Math.floor(
                  (firstDayOfMonth.getTime() - firstDayOfYear.getTime()) /
                    (1000 * 60 * 60 * 24)
                );
                const dayOfWeek = firstDayOfMonth.getDay();
                // Adjust to Monday = 0
                const adjustedDayOfWeek = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
                // Calculate week column: (days from start of year + offset) / 7
                const weekColumn = Math.floor(
                  (daysDiff + adjustedStartDay) / 7
                );
                const daysInMonth = new Date(year, idx + 1, 0).getDate();
                const weeksInMonth = Math.ceil(
                  (daysInMonth + adjustedDayOfWeek) / 7
                );

                // Each week column is 11px wide (w-[11px])
                // gap-1 between week columns = 0.25rem = 4px
                const cellWidth = 11; // w-[11px]
                const weekGap = 4; // gap-1 = 4px
                const dayLabelsWidth = 48; // w-12 = 3rem = 48px

                const leftPosition =
                  weekColumn * (cellWidth + weekGap) + dayLabelsWidth;
                const width = weeksInMonth * (cellWidth + weekGap) - weekGap;

                return (
                  <div
                    key={idx}
                    className="text-[10px] text-muted-foreground font-medium absolute top-0"
                    style={{
                      left: `${leftPosition}px`,
                      width: `${width}px`,
                    }}
                  >
                    {monthName}
                  </div>
                );
              });
            })()}
          </div>
          <div className="flex gap-1">
            {/* Day labels */}
            <div className="flex flex-col gap-1 w-12 shrink-0">
              {["", "Mon", "", "Wed", "", "Fri", ""].map((day, idx) => (
                <div
                  key={idx}
                  className="text-[10px] text-muted-foreground h-[11px]"
                >
                  {day}
                </div>
              ))}
            </div>
            {/* Days grid */}
            <div className="flex gap-1 flex-1">
              {(() => {
                const firstDayOfYear = new Date(year, 0, 1);
                const lastDayOfYear = new Date(year, 11, 31);
                const startDayOfWeek = firstDayOfYear.getDay();
                const totalDays =
                  Math.floor(
                    (lastDayOfYear.getTime() - firstDayOfYear.getTime()) /
                      (1000 * 60 * 60 * 24)
                  ) + 1;

                // Create array of all days
                const allDays: Array<{
                  date: Date;
                  dateKey: string;
                  weekIndex: number;
                  dayIndex: number;
                }> = [];

                // Add empty cells for days before Jan 1
                for (let i = 0; i < startDayOfWeek; i++) {
                  allDays.push({
                    date: new Date(year - 1, 11, 31 - (startDayOfWeek - i - 1)),
                    dateKey: "",
                    weekIndex: 0,
                    dayIndex: i,
                  });
                }

                // Add all days of the year
                for (let day = 1; day <= totalDays; day++) {
                  const date = new Date(year, 0, day);
                  const dateKey = `${year}-${String(
                    date.getMonth() + 1
                  ).padStart(2, "0")}-${String(date.getDate()).padStart(
                    2,
                    "0"
                  )}`;
                  const dayOfWeek = date.getDay();
                  const weekIndex = Math.floor((day - 1 + startDayOfWeek) / 7);
                  allDays.push({
                    date,
                    dateKey,
                    weekIndex,
                    dayIndex: dayOfWeek,
                  });
                }

                // Group by weeks
                const weeksArray: Array<
                  Array<{
                    date: Date;
                    dateKey: string;
                    weekIndex: number;
                    dayIndex: number;
                  }>
                > = [];
                allDays.forEach((day) => {
                  if (!weeksArray[day.weekIndex]) {
                    weeksArray[day.weekIndex] = [];
                  }
                  weeksArray[day.weekIndex][day.dayIndex] = day;
                });

                return weeksArray.map((week, weekIdx) => (
                  <div key={weekIdx} className="flex flex-col gap-1">
                    {week.map((day, dayIdx) => {
                      if (!day.dateKey) {
                        return (
                          <div
                            key={`empty-${weekIdx}-${dayIdx}`}
                            className="w-[11px] h-[11px]"
                          />
                        );
                      }

                      const dayData = filteredPLData[day.dateKey];
                      const net = dayData?.net || 0;
                      const isProfit = net >= 0;
                      const intensity = dayData ? getIntensity(net) : 0;
                      const selectedKey = selectedDate
                        ? `${selectedDate.getFullYear()}-${String(
                            selectedDate.getMonth() + 1
                          ).padStart(2, "0")}-${String(
                            selectedDate.getDate()
                          ).padStart(2, "0")}`
                        : null;
                      const isSelected = selectedKey === day.dateKey;

                      return (
                        <button
                          key={day.dateKey}
                          onClick={() => setSelectedDate(day.date)}
                          className={`w-[11px] h-[11px] rounded-sm transition-all hover:scale-125 hover:ring-1 hover:ring-white/50 ${
                            isSelected
                              ? "ring-2 ring-blue-500 ring-offset-1"
                              : ""
                          } ${
                            dayData
                              ? isProfit
                                ? "bg-blue-500"
                                : "bg-red-500"
                              : "bg-muted/20"
                          }`}
                          style={{
                            opacity: dayData ? 0.3 + intensity * 0.7 : 0.1,
                          }}
                          title={`${day.date.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}: ${formatAmount(net)}`}
                        />
                      );
                    })}
                  </div>
                ));
              })()}
            </div>
          </div>
        </div>
      ) : viewMode === "monthly" ? (
        <>
          <div className="grid grid-cols-7 gap-1 mb-2">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
              <div
                key={day}
                className="text-center text-xs font-medium text-muted-foreground py-1"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1" style={{ height: "380px" }}>
            {emptyDays.map((_, idx) => (
              <div key={`empty-${idx}`} />
            ))}
            {days.map((day) => {
              // Build date key to match ISO format (YYYY-MM-DD)
              const mm = String(month + 1).padStart(2, "0");
              const dd = String(day).padStart(2, "0");
              const dateKey = `${year}-${mm}-${dd}`;
              const date = new Date(year, month, day);
              const dayData = filteredPLData[dateKey];
              const net = dayData?.net || 0;
              const isProfit = net >= 0;
              const intensity = dayData ? getIntensity(net) : 0;
              const selectedKey = selectedDate
                ? `${selectedDate.getFullYear()}-${String(
                    selectedDate.getMonth() + 1
                  ).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(
                    2,
                    "0"
                  )}`
                : null;
              const isSelected = selectedKey === dateKey;

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDate(date)}
                  className={`h-full rounded-md text-xs font-medium transition-all hover:scale-105 ${
                    isSelected
                      ? "ring-2 ring-blue-500 ring-offset-2 ring-offset-background"
                      : ""
                  } ${
                    dayData
                      ? isProfit
                        ? "bg-blue-500/80 text-white"
                        : "bg-red-500/80 text-white"
                      : "bg-muted/30 text-muted-foreground"
                  }`}
                  style={{
                    opacity: dayData ? 0.5 + intensity * 0.5 : 0.3,
                  }}
                >
                  <div className="flex flex-col h-full justify-center items-center p-1">
                    <span className="text-[10px] font-bold">{day}</span>
                    {dayData && (
                      <span className="text-[9px] mt-0.5">
                        {formatAmount(net)}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </>
      ) : (
        <div className="grid grid-cols-4 gap-2" style={{ height: "380px" }}>
          {monthNames.map((monthName, idx) => {
            const monthNum = idx + 1;
            const monthKey = `${year}-${String(monthNum).padStart(2, "0")}`;
            const monthData = filteredPLData[monthKey];
            const net = monthData?.net || 0;
            const isProfit = net >= 0;
            const intensity = monthData ? getIntensity(net) : 0;
            const isSelected =
              selectedDate &&
              selectedDate.getFullYear() === year &&
              selectedDate.getMonth() === idx;

            return (
              <button
                key={monthNum}
                onClick={() => setSelectedDate(new Date(year, idx, 1))}
                className={`rounded-md text-xs font-medium transition-all hover:scale-105 ${
                  isSelected
                    ? "ring-2 ring-blue-500 ring-offset-2 ring-offset-background"
                    : ""
                } ${
                  monthData
                    ? isProfit
                      ? "bg-blue-500/80 text-white"
                      : "bg-red-500/80 text-white"
                    : "bg-muted/30 text-muted-foreground"
                }`}
                style={{
                  opacity: monthData ? 0.5 + intensity * 0.5 : 0.3,
                }}
              >
                <div className="flex flex-col h-full justify-center items-center p-2">
                  <span className="text-xs font-bold">{monthName}</span>
                  {monthData && (
                    <span className="text-[10px] mt-1">
                      {formatAmount(net)}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
