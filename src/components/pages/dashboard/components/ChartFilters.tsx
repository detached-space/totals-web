import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../ui/select";

export interface ChartFiltersProps {
  dateFilter: "week" | "month" | "year" | "custom";
  onDateFilterChange: (filter: "week" | "month" | "year" | "custom") => void;
  transactionTypeFilter: "all" | "credit" | "debit";
  onTransactionTypeFilterChange: (filter: "all" | "credit" | "debit") => void;
  selectedBanks: number[];
  onBankFilterChange: (banks: number[]) => void;
  availableBanks: number[];
  customStartDate?: string;
  customEndDate?: string;
  onCustomDateChange?: (start: string, end: string) => void;
}

export function ChartFilters({
  dateFilter,
  onDateFilterChange,
  transactionTypeFilter,
  onTransactionTypeFilterChange,
  selectedBanks,
  onBankFilterChange,
  availableBanks,
  customStartDate,
  customEndDate,
  onCustomDateChange,
}: ChartFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <Select value={dateFilter} onValueChange={onDateFilterChange}>
        <SelectTrigger className="w-[120px] h-8 text-xs">
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
        value={transactionTypeFilter}
        onValueChange={onTransactionTypeFilterChange}
      >
        <SelectTrigger className="w-[120px] h-8 text-xs">
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
          selectedBanks.length === 0
            ? "all"
            : selectedBanks.length === availableBanks.length
            ? "all"
            : selectedBanks.length === 1
            ? `bank-${selectedBanks[0]}`
            : "selected"
        }
        onValueChange={(value) => {
          if (value === "all") {
            onBankFilterChange([]);
          } else if (value.startsWith("bank-")) {
            const bankId = parseInt(value.replace("bank-", ""));
            if (selectedBanks.includes(bankId)) {
              onBankFilterChange(selectedBanks.filter((b) => b !== bankId));
            } else {
              onBankFilterChange([...selectedBanks, bankId]);
            }
          }
        }}
      >
        <SelectTrigger className="w-[140px] h-8 text-xs">
          <SelectValue
            placeholder={
              selectedBanks.length === 0
                ? "All banks"
                : `${selectedBanks.length} bank(s)`
            }
          />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All banks</SelectItem>
          {availableBanks.map((bankId) => (
            <SelectItem key={bankId} value={`bank-${bankId}`}>
              {selectedBanks.includes(bankId) && "✓ "}Bank {bankId}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {dateFilter === "custom" && (
        <div className="flex gap-2">
          <input
            type="date"
            value={customStartDate || ""}
            onChange={(e) =>
              onCustomDateChange?.(e.target.value, customEndDate || "")
            }
            className="h-8 px-2 text-xs border rounded bg-background"
          />
          <input
            type="date"
            value={customEndDate || ""}
            onChange={(e) =>
              onCustomDateChange?.(customStartDate || "", e.target.value)
            }
            className="h-8 px-2 text-xs border rounded bg-background"
          />
        </div>
      )}
    </div>
  );
}
