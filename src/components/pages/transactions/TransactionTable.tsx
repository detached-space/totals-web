import { useState, useMemo, useRef } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import type { Transaction } from "../../../lib/types";
import type { TransactionTableColumn } from "./types";
import { Input } from "../../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Checkbox } from "../../ui/checkbox";

interface TransactionTableProps {
  transactions: Transaction[];
  columns: TransactionTableColumn[];
  selectedIds: Set<string>;
  onSelectionChange: (ids: Set<string>) => void;
  onRowClick: (transaction: Transaction) => void;
  onCellEdit?: (transactionId: string, field: string, value: string) => void;
  sortColumn?: string;
  sortDirection?: "asc" | "desc";
  onSortChange?: (column: string, direction: "asc" | "desc") => void;
  getBankName?: (bankId?: number) => string;
}

const ROW_HEIGHT = 44;
const HEADER_HEIGHT = 36;
const VISIBLE_ROWS = 20;

export function TransactionTable({
  transactions,
  columns,
  selectedIds,
  onSelectionChange,
  onRowClick,
  onCellEdit,
  sortColumn,
  sortDirection,
  onSortChange,
  getBankName = (bankId?: number) => `Bank ${bankId || ""}`,
}: TransactionTableProps) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [editingCell, setEditingCell] = useState<{
    id: string;
    field: string;
  } | null>(null);
  const [editValue, setEditValue] = useState("");

  const visibleColumns = useMemo(
    () =>
      columns.filter((col) => col.visible).sort((a, b) => a.order - b.order),
    [columns]
  );

  const sortedTransactions = useMemo(() => {
    if (!sortColumn || !sortDirection) return transactions;
    return [...transactions].sort((a, b) => {
      const aVal = (a as unknown as Record<string, unknown>)[sortColumn];
      const bVal = (b as unknown as Record<string, unknown>)[sortColumn];
      if (aVal === undefined || aVal === null) return 1;
      if (bVal === undefined || bVal === null) return -1;
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
      }
      const aStr = String(aVal).toLowerCase();
      const bStr = String(bVal).toLowerCase();
      return sortDirection === "asc"
        ? aStr.localeCompare(bStr)
        : bStr.localeCompare(aStr);
    });
  }, [transactions, sortColumn, sortDirection]);

  const startIndex = Math.floor(scrollTop / ROW_HEIGHT);
  const endIndex = Math.min(
    startIndex + VISIBLE_ROWS + 2,
    sortedTransactions.length
  );
  const visibleTransactions = sortedTransactions.slice(startIndex, endIndex);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === sortedTransactions.length) {
      onSelectionChange(new Set());
    } else {
      onSelectionChange(
        new Set(sortedTransactions.map((t) => t.id || "").filter(Boolean))
      );
    }
  };

  const toggleSelect = (id: string) => {
    const newSelection = new Set(selectedIds);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    onSelectionChange(newSelection);
  };

  const startEdit = (transaction: Transaction, field: string) => {
    setEditingCell({ id: transaction.id || "", field });
    const value = (transaction as unknown as Record<string, unknown>)[field];
    setEditValue(String(value || ""));
  };

  const saveEdit = () => {
    if (editingCell && onCellEdit) {
      onCellEdit(editingCell.id, editingCell.field, editValue);
    }
    setEditingCell(null);
    setEditValue("");
  };

  const cancelEdit = () => {
    setEditingCell(null);
    setEditValue("");
  };

  const getRowColor = (transaction: Transaction) => {
    if (transaction.isFlagged || transaction.status === "Unclassified") {
      return "bg-amber-500/5 border-l-2 border-l-amber-500";
    }
    if (
      transaction.type === "CREDIT" ||
      (transaction.amount > 0 && !transaction.type)
    ) {
      return "bg-green-500/5 border-l-2 border-l-green-500";
    }
    if (transaction.type === "DEBIT" || transaction.amount < 0) {
      return "bg-red-500/5 border-l-2 border-l-red-500";
    }
    return "";
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Math.abs(amount));
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleSort = (columnId: string) => {
    if (!onSortChange) return;
    const newDirection =
      sortColumn === columnId && sortDirection === "asc" ? "desc" : "asc";
    onSortChange(columnId, newDirection);
  };

  const totalWidth = useMemo(() => {
    return 40 + visibleColumns.reduce((sum, col) => sum + col.width, 0);
  }, [visibleColumns]);

  return (
    <div className="flex flex-col h-full bg-[var(--color-background)] min-w-0">
      {/* Header */}
      <div
        className="border-b border-[var(--color-card-border)] bg-[var(--color-background)] sticky top-0 z-20 shrink-0 overflow-x-auto overflow-y-hidden"
        style={{ height: HEADER_HEIGHT }}
        onScroll={(e) => {
          if (containerRef.current) {
            containerRef.current.scrollLeft = e.currentTarget.scrollLeft;
          }
        }}
      >
        <div
          className="flex h-full"
          style={{ width: totalWidth, minWidth: totalWidth }}
        >
          <div className="w-10 flex items-center justify-center border-r border-[var(--color-card-border)] shrink-0">
            <Checkbox
              checked={
                selectedIds.size === sortedTransactions.length &&
                sortedTransactions.length > 0
              }
              onCheckedChange={toggleSelectAll}
            />
          </div>
          {visibleColumns.map((col) => (
            <div
              key={col.id}
              className={`flex items-center px-2 border-r border-[var(--color-card-border)] cursor-pointer hover:bg-[var(--color-foreground)]/5 shrink-0 ${
                col.sticky ? "sticky bg-[var(--color-background)] z-10" : ""
              }`}
              style={{
                width: col.width,
                minWidth: col.width,
                left:
                  col.sticky && col.id === "date"
                    ? 40
                    : col.sticky
                    ? 40 +
                      (visibleColumns.find((c) => c.id === "date")?.width || 0)
                    : undefined,
              }}
              onClick={() => handleSort(col.id)}
            >
              <span className="text-xs font-medium text-[var(--color-foreground)]/70 truncate">
                {col.label}
              </span>
              {sortColumn === col.id && (
                <span className="ml-1">
                  {sortDirection === "asc" ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Table Body */}
      <div
        ref={containerRef}
        className="flex-1 overflow-auto min-w-0"
        onScroll={handleScroll}
        style={{ height: `calc(100% - ${HEADER_HEIGHT}px)` }}
      >
        <div
          style={{
            height: sortedTransactions.length * ROW_HEIGHT,
            position: "relative",
            width: totalWidth,
            minWidth: totalWidth,
          }}
        >
          <div
            style={{
              transform: `translateY(${startIndex * ROW_HEIGHT}px)`,
              position: "absolute",
              top: 0,
              left: 0,
              width: totalWidth,
            }}
          >
            {visibleTransactions.map((transaction, idx) => {
              const isSelected = selectedIds.has(transaction.id || "");
              const isEditing = editingCell?.id === transaction.id;

              return (
                <div
                  key={transaction.id || `txn-${startIndex + idx}`}
                  className={`flex items-center border-b border-[var(--color-card-border)] hover:bg-[var(--color-foreground)]/5 cursor-pointer transition-colors ${getRowColor(
                    transaction
                  )} ${isSelected ? "bg-blue-500/10" : ""}`}
                  style={{ height: ROW_HEIGHT, width: totalWidth }}
                  onClick={(e) => {
                    if (
                      !(e.target as HTMLElement).closest(
                        "input, select, button"
                      )
                    ) {
                      onRowClick(transaction);
                    }
                  }}
                >
                  <div className="w-10 flex items-center justify-center border-r border-[var(--color-card-border)] shrink-0">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={(checked) => {
                        if (checked !== undefined) {
                          toggleSelect(transaction.id || "");
                        }
                      }}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>

                  {visibleColumns.map((col) => {
                    const value = (
                      transaction as unknown as Record<string, unknown>
                    )[col.id];
                    const isCellEditing =
                      isEditing && editingCell?.field === col.id;

                    return (
                      <div
                        key={col.id}
                        className={`px-2 border-r border-[var(--color-card-border)] shrink-0 ${
                          col.sticky ? "sticky bg-inherit z-10" : ""
                        }`}
                        style={{
                          width: col.width,
                          minWidth: col.width,
                          left:
                            col.sticky && col.id === "date"
                              ? 40
                              : col.sticky && col.id === "amount"
                              ? 40 +
                                (visibleColumns.find((c) => c.id === "date")
                                  ?.width || 0)
                              : undefined,
                        }}
                        onDoubleClick={() => {
                          if (
                            ["category", "counterparty", "notes"].includes(
                              col.id
                            )
                          ) {
                            startEdit(transaction, col.id);
                          }
                        }}
                      >
                        {isCellEditing ? (
                          <div className="flex items-center gap-1">
                            {col.id === "category" ? (
                              <Select
                                value={editValue}
                                onValueChange={setEditValue}
                                onOpenChange={(open) => {
                                  if (!open) saveEdit();
                                }}
                              >
                                <SelectTrigger className="h-8 text-xs">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="">
                                    Uncategorized
                                  </SelectItem>
                                  <SelectItem value="Salary">Salary</SelectItem>
                                  <SelectItem value="Expense">
                                    Expense
                                  </SelectItem>
                                  <SelectItem value="Transfer">
                                    Transfer
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            ) : (
                              <>
                                <Input
                                  value={editValue}
                                  onChange={(e) => setEditValue(e.target.value)}
                                  onBlur={saveEdit}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") saveEdit();
                                    if (e.key === "Escape") cancelEdit();
                                  }}
                                  className="h-8 text-xs"
                                  autoFocus
                                />
                              </>
                            )}
                          </div>
                        ) : (
                          <div className="text-xs text-[var(--color-foreground)] truncate">
                            {col.id === "date" && formatDate(transaction.time)}
                            {col.id === "direction" && (
                              <span className="flex items-center gap-1">
                                {transaction.type === "CREDIT" ||
                                transaction.amount > 0 ? (
                                  <ArrowDownLeft
                                    size={14}
                                    className="text-green-500 shrink-0"
                                  />
                                ) : (
                                  <ArrowUpRight
                                    size={14}
                                    className="text-red-500 shrink-0"
                                  />
                                )}
                                <span className="truncate">
                                  {transaction.type === "CREDIT" ||
                                  transaction.amount > 0
                                    ? "In"
                                    : "Out"}
                                </span>
                              </span>
                            )}
                            {col.id === "amount" && (
                              <span
                                className={
                                  transaction.amount >= 0
                                    ? "text-green-600"
                                    : "text-red-600"
                                }
                              >
                                {transaction.amount >= 0 ? "+" : "-"}
                                {formatAmount(transaction.amount)}
                              </span>
                            )}
                            {col.id === "currency" &&
                              (transaction.currency || "ETB")}
                            {col.id === "bank" &&
                              getBankName(transaction.bankId)}
                            {col.id === "account" && transaction.accountNumber}
                            {col.id === "counterparty" &&
                              (transaction.counterparty ||
                                transaction.creditor ||
                                "-")}
                            {col.id === "reference" && transaction.reference}
                            {col.id === "category" &&
                              (transaction.category || "-")}
                            {col.id === "status" && (
                              <span
                                className={`px-1.5 py-0.5 rounded text-xs ${
                                  transaction.status === "CLEARED"
                                    ? "bg-green-500/20 text-green-600"
                                    : transaction.status === "PENDING"
                                    ? "bg-yellow-500/20 text-yellow-600"
                                    : "bg-gray-500/20 text-gray-600"
                                }`}
                              >
                                {transaction.status || "Unknown"}
                              </span>
                            )}
                            {col.id === "notes" && (transaction.notes || "-")}
                            {![
                              "date",
                              "direction",
                              "amount",
                              "currency",
                              "bank",
                              "account",
                              "counterparty",
                              "reference",
                              "category",
                              "status",
                              "notes",
                            ].includes(col.id) && String(value || "-")}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
