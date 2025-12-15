import { Search, X, Regex } from "lucide-react";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  useRegex: boolean;
  onRegexToggle: (useRegex: boolean) => void;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChange,
  useRegex,
  onRegexToggle,
  placeholder = "Search transactions...",
}: SearchBarProps) {
  return (
    <div className="relative flex items-center gap-1.5">
      <div className="relative flex-1">
        <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--color-foreground)]/50" />
        <Input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-8 pr-8 h-7 text-xs"
        />
        {value && (
          <button
            onClick={() => onChange("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--color-foreground)]/50 hover:text-[var(--color-foreground)]"
          >
            <X size={14} />
          </button>
        )}
      </div>
      <Button
        variant={useRegex ? "default" : "outline"}
        size="sm"
        onClick={() => onRegexToggle(!useRegex)}
        className="shrink-0 h-7 px-2"
        title="Toggle regex mode"
      >
        <Regex size={14} />
      </Button>
    </div>
  );
}
