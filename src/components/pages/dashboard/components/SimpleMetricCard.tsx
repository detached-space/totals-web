export interface SimpleMetricCardProps {
  title: string;
  value: string;
  unit: string;
}

export function SimpleMetricCard({
  title,
  value,
  unit,
}: SimpleMetricCardProps) {
  return (
    <div className="border rounded-lg p-4 bg-card">
      <h3 className="text-xs font-medium text-muted-foreground mb-2">
        {title}
      </h3>
      <div className="text-xl font-semibold text-foreground">
        {unit && unit !== "" ? `${unit} ` : ""}
        {value}
      </div>
    </div>
  );
}

