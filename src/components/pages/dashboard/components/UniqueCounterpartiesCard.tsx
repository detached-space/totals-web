import { useState } from "react";
import { Users, ArrowDownLeft, ArrowUpRight } from "lucide-react";

export interface UniqueCounterpartiesCardProps {
  uniqueReceivers: number;
  uniqueSenders: number;
  totalUnique: number;
}

export function UniqueCounterpartiesCard({
  uniqueReceivers,
  uniqueSenders,
  totalUnique,
}: UniqueCounterpartiesCardProps) {
  const [activeTab, setActiveTab] = useState<"all" | "receivers" | "senders">(
    "all"
  );

  return (
    <div className="border rounded-lg p-4 bg-card">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-medium text-muted-foreground">
          Unique Counterparties
        </h3>
        <Users className="h-4 w-4 text-purple-500" />
      </div>

      <div className="flex items-baseline gap-2 mb-3">
        <div className="text-2xl font-bold text-foreground">{totalUnique}</div>
      </div>

      <div className="mt-3 pt-3 border-t border-border/50">
        <div className="flex gap-2 mb-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveTab("all");
            }}
            className={`text-xs px-2 py-1 rounded transition-colors ${
              activeTab === "all"
                ? "bg-purple-500/20 text-purple-600 dark:text-purple-400"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            All
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveTab("receivers");
            }}
            className={`text-xs px-2 py-1 rounded transition-colors flex items-center gap-1 ${
              activeTab === "receivers"
                ? "bg-green-500/20 text-green-600 dark:text-green-400"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            <ArrowDownLeft className="h-3 w-3" />
            Receivers
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveTab("senders");
            }}
            className={`text-xs px-2 py-1 rounded transition-colors flex items-center gap-1 ${
              activeTab === "senders"
                ? "bg-blue-500/20 text-blue-600 dark:text-blue-400"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            <ArrowUpRight className="h-3 w-3" />
            Senders
          </button>
        </div>

        <div className="space-y-2">
          {activeTab === "all" && (
            <>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground flex items-center gap-1">
                  <ArrowDownLeft className="h-3 w-3 text-green-500" />
                  Receivers
                </span>
                <span className="font-semibold text-green-500">
                  {uniqueReceivers}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground flex items-center gap-1">
                  <ArrowUpRight className="h-3 w-3 text-blue-500" />
                  Senders
                </span>
                <span className="font-semibold text-blue-500">
                  {uniqueSenders}
                </span>
              </div>
            </>
          )}
          {activeTab === "receivers" && (
            <div className="text-xs text-center py-2 text-muted-foreground">
              {uniqueReceivers} unique receiver
              {uniqueReceivers !== 1 ? "s" : ""}
            </div>
          )}
          {activeTab === "senders" && (
            <div className="text-xs text-center py-2 text-muted-foreground">
              {uniqueSenders} unique sender{uniqueSenders !== 1 ? "s" : ""}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
