export interface TotalIncomeCardProps {
  totalIncome: number;
  isSelected?: boolean;
  onClick?: () => void;
}

export function TotalIncomeCard({
  totalIncome,
  isSelected = false,
  onClick,
}: TotalIncomeCardProps) {
  return (
    <div
      onClick={onClick}
      className={`border rounded-lg p-4 bg-card cursor-pointer transition-all ${
        isSelected
          ? "border-blue-500 ring-2 ring-blue-500/20 bg-blue-500/5"
          : "border-border hover:border-blue-500/50 hover:bg-accent/50"
      }`}
    >
      <div className="text-xs font-medium text-muted-foreground mb-2">
        Total Income
      </div>
      <div className="text-2xl font-bold text-blue-500">
        ETB{" "}
        {totalIncome.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </div>
    </div>
  );
}

