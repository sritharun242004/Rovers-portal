import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { memo, useRef, useCallback, useEffect } from 'react';

interface SearchInputProps {
  onSearch: (value: string) => void;
  disabled?: boolean;
}

const SearchInput = memo(function SearchInput({ onSearch, disabled }: SearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastCursorPosition = useRef<number>(0);

  const handleChange = useCallback(() => {
    if (!inputRef.current) return;
    
    const value = inputRef.current.value;
    lastCursorPosition.current = inputRef.current.selectionStart || 0;

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout for search
    timeoutRef.current = setTimeout(() => {
      onSearch(value);
      timeoutRef.current = null;
    }, 300);
  }, [onSearch]);

  // Force focus and cursor position after any re-render
  useEffect(() => {
    const input = inputRef.current;
    if (input) {
      // Use requestAnimationFrame to ensure this happens after React's rendering cycle
      requestAnimationFrame(() => {
        input.focus();
        input.setSelectionRange(lastCursorPosition.current, lastCursorPosition.current);
      });
    }
  });

  return (
    <div className="relative">
      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
      <Input
        ref={inputRef}
        type="text"
        placeholder="Search students by name..."
        onChange={handleChange}
        className="pl-9"
        disabled={disabled}
        autoComplete="off"
        onFocus={(e) => {
          lastCursorPosition.current = e.target.selectionStart || 0;
        }}
      />
    </div>
  );
});

export default SearchInput;