export interface TotalExpenseCardProps {
  totalExpense: number;
  isSelected?: boolean;
  onClick?: () => void;
}

export function TotalExpenseCard({
  totalExpense,
  isSelected = false,
  onClick,
}: TotalExpenseCardProps) {
  return (
    <div
      onClick={onClick}
      className={`border rounded-lg p-4 bg-card cursor-pointer transition-all ${
        isSelected
          ? "border-red-500 ring-2 ring-red-500/20 bg-red-500/5"
          : "border-border hover:border-red-500/50 hover:bg-accent/50"
      }`}
    >
      <div className="text-xs font-medium text-muted-foreground mb-2">
        Total Expense
      </div>
      <div className="text-2xl font-bold text-red-500">
        ETB{" "}
        {totalExpense.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </div>
    </div>
  );
}

