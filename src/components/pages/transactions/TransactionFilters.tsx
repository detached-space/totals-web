import { useState } from "react";
import { CalendarIcon, Filter } from "lucide-react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Calendar } from "../../ui/calendar";
import { Checkbox } from "../../ui/checkbox";
import { format } from "date-fns";
import type { TransactionFilters } from "./types";
import type { Account } from "../../../lib/types";

interface TransactionFiltersProps {
  filters: TransactionFilters;
  onFiltersChange: (filters: TransactionFilters) => void;
  accounts: Account[];
  availableBanks: number[];
  availableCategories: string[];
  availableTags: string[];
}

export function TransactionFiltersPanel({
  filters,
  onFiltersChange,
  accounts,
  availableBanks,
  availableCategories,
  availableTags,
  getBankName,
}: TransactionFiltersProps & { getBankName?: (bankId?: number) => string }) {
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [showEndCalendar, setShowEndCalendar] = useState(false);

  const updateFilter = <K extends keyof TransactionFilters>(
    key: K,
    value: TransactionFilters[K]
  ) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleBank = (bankId: number) => {
    const newBanks = filters.selectedBanks.includes(bankId)
      ? filters.selectedBanks.filter((id) => id !== bankId)
      : [...filters.selectedBanks, bankId];
    updateFilter("selectedBanks", newBanks);
  };

  const toggleAccount = (accountNumber: string) => {
    const newAccounts = filters.selectedAccounts.includes(accountNumber)
      ? filters.selectedAccounts.filter((acc) => acc !== accountNumber)
      : [...filters.selectedAccounts, accountNumber];
    updateFilter("selectedAccounts", newAccounts);
  };

  const toggleTag = (tag: string) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter((t) => t !== tag)
      : [...filters.tags, tag];
    updateFilter("tags", newTags);
  };

  const toggleStatus = (status: TransactionFilters["status"][number]) => {
    const newStatus = filters.status.includes(status)
      ? filters.status.filter((s) => s !== status)
      : [...filters.status, status];
    updateFilter("status", newStatus);
  };

  const clearFilters = () => {
    onFiltersChange({
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
  };

  const activeFilterCount = [
    filters.dateRange !== "All",
    filters.selectedBanks.length > 0,
    filters.selectedAccounts.length > 0,
    filters.direction !== "all",
    filters.minAmount !== undefined || filters.maxAmount !== undefined,
    filters.counterparty !== undefined,
    filters.category !== undefined,
    filters.tags.length > 0,
    filters.status.length > 0,
    filters.minConfidence !== undefined,
    filters.missingReference,
    filters.duplicateCandidates,
    filters.smsSenderId !== undefined,
  ].filter(Boolean).length;

  return (
    <div className="w-64 bg-[var(--color-background)] border-r border-[var(--color-card-border)] flex flex-col h-full overflow-y-auto shrink-0">
      <div className="p-3 border-b border-[var(--color-card-border)] sticky top-0 bg-[var(--color-background)] z-10">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold flex items-center gap-1.5">
            <Filter size={14} />
            Filters
          </h2>
          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-6 px-1.5 text-xs"
            >
              Clear ({activeFilterCount})
            </Button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* Date Range */}
        <div>
          <label className="text-xs font-medium mb-1.5 block">Date Range</label>
          <Select
            value={filters.dateRange}
            onValueChange={(value) =>
              updateFilter(
                "dateRange",
                value as TransactionFilters["dateRange"]
              )
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Time</SelectItem>
              <SelectItem value="Today">Today</SelectItem>
              <SelectItem value="WTD">Week to Date</SelectItem>
              <SelectItem value="MTD">Month to Date</SelectItem>
              <SelectItem value="QTD">Quarter to Date</SelectItem>
              <SelectItem value="YTD">Year to Date</SelectItem>
              <SelectItem value="Custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
          {filters.dateRange === "Custom" && (
            <div className="mt-2 space-y-2">
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-left font-normal"
                  onClick={() => {
                    setShowStartCalendar(!showStartCalendar);
                    setShowEndCalendar(false);
                  }}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.customStartDate ? (
                    format(filters.customStartDate, "MMM dd, yyyy")
                  ) : (
                    <span>Start date</span>
                  )}
                </Button>
                {showStartCalendar && (
                  <div className="absolute top-full mt-1 left-0 z-50 bg-popover border border-border rounded-lg shadow-lg">
                    <Calendar
                      mode="single"
                      selected={filters.customStartDate}
                      onSelect={(date) => {
                        updateFilter("customStartDate", date);
                        setShowStartCalendar(false);
                      }}
                    />
                  </div>
                )}
              </div>
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-left font-normal"
                  onClick={() => {
                    setShowEndCalendar(!showEndCalendar);
                    setShowStartCalendar(false);
                  }}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.customEndDate ? (
                    format(filters.customEndDate, "MMM dd, yyyy")
                  ) : (
                    <span>End date</span>
                  )}
                </Button>
                {showEndCalendar && (
                  <div className="absolute top-full mt-1 left-0 z-50 bg-popover border border-border rounded-lg shadow-lg">
                    <Calendar
                      mode="single"
                      selected={filters.customEndDate}
                      onSelect={(date) => {
                        updateFilter("customEndDate", date);
                        setShowEndCalendar(false);
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Bank Filter */}
        <div>
          <label className="text-xs font-medium mb-1.5 block">Banks</label>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {availableBanks.map((bankId) => (
              <label
                key={bankId}
                className="flex items-center gap-1.5 p-1.5 rounded hover:bg-[var(--color-foreground)]/5 cursor-pointer"
              >
                <Checkbox
                  checked={filters.selectedBanks.includes(bankId)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      // Add bank if not already in list
                      if (!filters.selectedBanks.includes(bankId)) {
                        toggleBank(bankId);
                      }
                    } else {
                      // Remove bank if in list
                      if (filters.selectedBanks.includes(bankId)) {
                        toggleBank(bankId);
                      }
                    }
                  }}
                />
                <span className="text-xs">
                  {getBankName ? getBankName(bankId) : `Bank ${bankId}`}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Account Filter */}
        <div>
          <label className="text-xs font-medium mb-1.5 block">Accounts</label>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {accounts.map((account) => (
              <label
                key={account.accountNumber}
                className="flex items-center gap-1.5 p-1.5 rounded hover:bg-[var(--color-foreground)]/5 cursor-pointer"
              >
                <Checkbox
                  checked={filters.selectedAccounts.includes(
                    account.accountNumber
                  )}
                  onCheckedChange={() => toggleAccount(account.accountNumber)}
                />
                <span className="text-xs truncate">
                  {account.accountNumber}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Direction */}
        <div>
          <label className="text-xs font-medium mb-1.5 block">Direction</label>
          <Select
            value={filters.direction}
            onValueChange={(value) =>
              updateFilter(
                "direction",
                value as TransactionFilters["direction"]
              )
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="inflow">Inflow</SelectItem>
              <SelectItem value="outflow">Outflow</SelectItem>
              <SelectItem value="transfer">Transfer</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Amount Range */}
        <div>
          <label className="text-xs font-medium mb-1.5 block">
            Amount Range
          </label>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Min"
              value={filters.minAmount ?? ""}
              onChange={(e) =>
                updateFilter(
                  "minAmount",
                  e.target.value ? parseFloat(e.target.value) : undefined
                )
              }
              className="flex-1"
            />
            <Input
              type="number"
              placeholder="Max"
              value={filters.maxAmount ?? ""}
              onChange={(e) =>
                updateFilter(
                  "maxAmount",
                  e.target.value ? parseFloat(e.target.value) : undefined
                )
              }
              className="flex-1"
            />
          </div>
        </div>

        {/* Counterparty */}
        <div>
          <label className="text-xs font-medium mb-1.5 block">
            Counterparty
          </label>
          <Input
            placeholder="Search counterparty..."
            value={filters.counterparty ?? ""}
            onChange={(e) =>
              updateFilter("counterparty", e.target.value || undefined)
            }
          />
        </div>

        {/* Category */}
        <div>
          <label className="text-xs font-medium mb-1.5 block">Category</label>
          <Select
            value={filters.category ?? "all"}
            onValueChange={(value) =>
              updateFilter("category", value === "all" ? undefined : value)
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {availableCategories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tags */}
        <div>
          <label className="text-xs font-medium mb-1.5 block">Tags</label>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {availableTags.map((tag) => (
              <label
                key={tag}
                className="flex items-center gap-1.5 p-1.5 rounded hover:bg-[var(--color-foreground)]/5 cursor-pointer"
              >
                <Checkbox
                  checked={filters.tags.includes(tag)}
                  onCheckedChange={() => toggleTag(tag)}
                />
                <span className="text-xs">{tag}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="text-xs font-medium mb-1.5 block">Status</label>
          <div className="space-y-1">
            {(["Parsed", "Manual", "Unclassified", "Flagged"] as const).map(
              (status) => (
                <label
                  key={status}
                  className="flex items-center gap-1.5 p-1.5 rounded hover:bg-[var(--color-foreground)]/5 cursor-pointer"
                >
                  <Checkbox
                    checked={filters.status.includes(status)}
                    onCheckedChange={() => toggleStatus(status)}
                  />
                  <span className="text-xs">{status}</span>
                </label>
              )
            )}
          </div>
        </div>

        {/* Technical Filters */}
        <div className="border-t border-[var(--color-card-border)] pt-3">
          <label className="text-xs font-medium mb-1.5 block">
            Technical Filters
          </label>

          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Parsing Confidence
              </label>
              <Input
                type="number"
                placeholder="Min %"
                min={0}
                max={100}
                value={filters.minConfidence ?? ""}
                onChange={(e) =>
                  updateFilter(
                    "minConfidence",
                    e.target.value ? parseInt(e.target.value) : undefined
                  )
                }
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={filters.missingReference}
                onCheckedChange={(checked) =>
                  updateFilter("missingReference", checked === true)
                }
              />
              <span className="text-sm">Missing Reference</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={filters.duplicateCandidates}
                onCheckedChange={(checked) =>
                  updateFilter("duplicateCandidates", checked === true)
                }
              />
              <span className="text-sm">Duplicate Candidates</span>
            </label>

            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                SMS Sender ID
              </label>
              <Input
                placeholder="e.g., 1234"
                value={filters.smsSenderId ?? ""}
                onChange={(e) =>
                  updateFilter("smsSenderId", e.target.value || undefined)
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
