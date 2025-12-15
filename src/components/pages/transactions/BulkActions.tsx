import { useState } from "react";
import { CheckCircle, Flag, Download, X } from "lucide-react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";

interface BulkActionsProps {
  selectedCount: number;
  onAssignCategory: (category: string) => void;
  onAssignCounterparty: (counterparty: string) => void;
  onAddTags: (tags: string[]) => void;
  onMarkReviewed: () => void;
  onFlag: () => void;
  onExport: () => void;
  availableCategories: string[];
}

export function BulkActions({
  selectedCount,
  onAssignCategory,
  onAssignCounterparty,
  onAddTags,
  onMarkReviewed,
  onFlag,
  onExport,
  availableCategories,
}: BulkActionsProps) {
  const [categoryValue, setCategoryValue] = useState("");
  const [counterpartyValue, setCounterpartyValue] = useState("");
  const [tagsValue, setTagsValue] = useState("");

  if (selectedCount === 0) return null;

  const handleAddTags = () => {
    const tags = tagsValue
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    if (tags.length > 0) {
      onAddTags(tags);
      setTagsValue("");
    }
  };

  return (
    <div className="border-b border-[var(--color-card-border)] bg-[var(--color-background)] px-4 py-2 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <span className="text-xs font-medium text-[var(--color-foreground)]">
          {selectedCount} selected
        </span>

        <div className="flex items-center gap-1.5">
          <Select value={categoryValue} onValueChange={setCategoryValue}>
            <SelectTrigger className="h-7 w-[140px] text-xs">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {availableCategories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {categoryValue && (
            <>
              <Button
                size="sm"
                onClick={() => {
                  onAssignCategory(categoryValue);
                  setCategoryValue("");
                }}
                className="h-7 px-2 text-xs"
              >
                Apply
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setCategoryValue("")}
                className="h-7 px-1.5"
              >
                <X size={12} />
              </Button>
            </>
          )}

          <Input
            placeholder="Counterparty"
            value={counterpartyValue}
            onChange={(e) => setCounterpartyValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && counterpartyValue) {
                onAssignCounterparty(counterpartyValue);
                setCounterpartyValue("");
              }
            }}
            className="h-7 w-[140px] text-xs"
          />
          {counterpartyValue && (
            <Button
              size="sm"
              onClick={() => {
                onAssignCounterparty(counterpartyValue);
                setCounterpartyValue("");
              }}
              className="h-7 px-2 text-xs"
            >
              Apply
            </Button>
          )}

          <div className="flex items-center gap-1.5">
            <Input
              placeholder="Tags"
              value={tagsValue}
              onChange={(e) => setTagsValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddTags();
                }
              }}
              className="h-7 w-[140px] text-xs"
            />
            {tagsValue && (
              <Button
                size="sm"
                onClick={handleAddTags}
                className="h-7 px-2 text-xs"
              >
                Add
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <Button
          size="sm"
          variant="outline"
          onClick={onMarkReviewed}
          className="h-7 px-2 text-xs"
        >
          <CheckCircle size={12} className="mr-1" />
          Reviewed
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={onFlag}
          className="h-7 px-2 text-xs"
        >
          <Flag size={12} className="mr-1" />
          Flag
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={onExport}
          className="h-7 px-2 text-xs"
        >
          <Download size={12} className="mr-1" />
          Export
        </Button>
      </div>
    </div>
  );
}
