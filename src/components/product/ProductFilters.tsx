"use client";
import { useState, useRef, useEffect } from "react";
import { Input }   from "@/components/ui/Input";
import { Button }  from "@/components/ui/Button";
import { PRODUCT_CATEGORIES, SORT_OPTIONS } from "@/constants";
import { Search, SlidersHorizontal, X, Loader2 } from "lucide-react";
import { useDebouncedSearch } from "@/hooks/useProducts";
import type { ProductFilters as IFilters } from "@/types/product.types";

interface ProductFiltersProps {
  filters:  IFilters;
  onChange: (filters: IFilters) => void;
  /** Pass all loaded product names for local suggestions */
  suggestions?: string[];
}

export function ProductFilters({ filters, onChange, suggestions = [] }: ProductFiltersProps) {
  const [showFilters, setShowFilters]       = useState(false);
  const [localSearch,  setLocalSearch]      = useState(filters.search || "");
  const [showDropdown, setShowDropdown]     = useState(false);
  const [highlighted,  setHighlighted]      = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Only fires API call after user stops typing 400ms
  const debouncedSearch = useDebouncedSearch(localSearch, 400);

  useEffect(() => {
    onChange({ ...filters, search: debouncedSearch || undefined, page: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  // Keep local in sync if parent resets filters
  useEffect(() => {
    if (!filters.search) setLocalSearch("");
  }, [filters.search]);

  // Fuzzy-style filter: match any word in the suggestion
  const matched = localSearch.trim().length > 0
    ? suggestions.filter((s) =>
        s.toLowerCase().includes(localSearch.toLowerCase())
      ).slice(0, 6)
    : [];

  const update = (key: keyof IFilters, value: unknown) =>
    onChange({ ...filters, [key]: value, page: 1 });

  const reset = () => {
    setLocalSearch("");
    onChange({ page: 1, limit: 12 });
  };

  const selectSuggestion = (name: string) => {
    setLocalSearch(name);
    setShowDropdown(false);
    onChange({ ...filters, search: name, page: 1 });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown || matched.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((h) => Math.min(h + 1, matched.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter" && highlighted >= 0) {
      e.preventDefault();
      selectSuggestion(matched[highlighted]);
    } else if (e.key === "Escape") {
      setShowDropdown(false);
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        !inputRef.current?.contains(e.target as Node) &&
        !dropdownRef.current?.contains(e.target as Node)
      ) setShowDropdown(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const hasActiveFilters = !!(filters.search || filters.category || filters.minPrice || filters.maxPrice);
  const isSearching = localSearch !== (debouncedSearch ?? "");

  return (
    <div className="space-y-4">
      {/* Search + Toggle */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Input
            ref={inputRef}
            placeholder="Search products by name, category…"
            value={localSearch}
            onChange={(e) => {
              setLocalSearch(e.target.value);
              setShowDropdown(true);
              setHighlighted(-1);
            }}
            onFocus={() => setShowDropdown(true)}
            onKeyDown={handleKeyDown}
            leftIcon={
              isSearching
                ? <Loader2 className="h-4 w-4 animate-spin text-amber-500" />
                : <Search className="h-4 w-4" />
            }
          />

          {/* Suggestions Dropdown */}
          {showDropdown && matched.length > 0 && (
            <div
              ref={dropdownRef}
              className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg"
            >
              {matched.map((name, i) => (
                <button
                  key={name}
                  type="button"
                  onMouseDown={() => selectSuggestion(name)}
                  className={`flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm transition-colors ${
                    i === highlighted
                      ? "bg-amber-50 text-amber-700"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <Search className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                  {/* Highlight matching portion */}
                  {highlightMatch(name, localSearch)}
                </button>
              ))}
            </div>
          )}
        </div>

        <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {hasActiveFilters && (
            <span className="flex h-2 w-2 rounded-full bg-amber-500" />
          )}
        </Button>
        {hasActiveFilters && (
          <Button variant="ghost" onClick={reset}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="grid grid-cols-2 gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-4">

          {/* Category */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-600">Category</label>
            <select
              value={filters.category || ""}
              onChange={(e) => update("category", e.target.value || undefined)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all duration-150"
            >
              <option value="">All Categories</option>
              {PRODUCT_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Min Price */}
          <Input
            label="Min Price ($)"
            type="number"
            min={0}
            value={filters.minPrice || ""}
            onChange={(e) => update("minPrice", e.target.value ? Number(e.target.value) : undefined)}
          />

          {/* Max Price */}
          <Input
            label="Max Price ($)"
            type="number"
            min={0}
            value={filters.maxPrice || ""}
            onChange={(e) => update("maxPrice", e.target.value ? Number(e.target.value) : undefined)}
          />

          {/* Sort */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-600">Sort By</label>
            <select
              value={`${filters.sort || "createdAt"}_${filters.order || "desc"}`}
              onChange={(e) => {
                const [sort, order] = e.target.value.split("_");
                onChange({ ...filters, sort, order: order as "asc" | "desc", page: 1 });
              }}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all duration-150"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={`${opt.value}_${opt.order}`} value={`${opt.value}_${opt.order}`}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

        </div>
      )}
    </div>
  );
}

/** Bold the matching substring inside a suggestion */
function highlightMatch(text: string, query: string) {
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <span>{text}</span>;
  return (
    <>
      <span>{text.slice(0, idx)}</span>
      <span className="font-semibold text-amber-600">{text.slice(idx, idx + query.length)}</span>
      <span>{text.slice(idx + query.length)}</span>
    </>
  );
}