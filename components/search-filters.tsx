"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDebounce } from "@/hooks/use-debounce";
import { capitalize } from "@/lib/utils";
import { useEffect } from "react";

interface SearchFiltersProps {
  categories: string[];
}

export function SearchFilters({ categories }: SearchFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const debouncedQuery = useDebounce(query, 400);

  const updateParam = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (!value || value === "all" || value === "default") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      router.push(`/products?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  // Push debounced query to URL
  useEffect(() => {
    updateParam("q", debouncedQuery);
  }, [debouncedQuery]); // eslint-disable-line

  const activeCategory = searchParams.get("category") ?? "";
  const activeSort = searchParams.get("sort") ?? "";
  const activeQ = searchParams.get("q") ?? "";

  const hasFilters = activeCategory || activeSort || activeQ;
  const activeFilterCount = [activeCategory, activeSort, activeQ].filter(Boolean).length;

  const clearAll = () => {
    setQuery("");
    router.push("/products");
  };

  return (
    <div className="space-y-4">
      {/* Search Row */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="pl-9"
          />
          <AnimatePresence>
            {query && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <SlidersHorizontal className="h-3.5 w-3.5" />
          Filters
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="h-4 w-4 p-0 flex items-center justify-center text-[10px]">
              {activeFilterCount}
            </Badge>
          )}
        </span>

        <Select
          value={activeCategory || "all"}
          onValueChange={(v) => updateParam("category", v)}
        >
          <SelectTrigger className="w-44">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat} className="capitalize">
                {capitalize(cat)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={activeSort || "default"}
          onValueChange={(v) => updateParam("sort", v)}
        >
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default</SelectItem>
            <SelectItem value="price-asc">Price: Low → High</SelectItem>
            <SelectItem value="price-desc">Price: High → Low</SelectItem>
            <SelectItem value="rating">Top Rated</SelectItem>
            <SelectItem value="discount">Biggest Discount</SelectItem>
          </SelectContent>
        </Select>

        <AnimatePresence>
          {hasFilters && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
              <Button variant="ghost" size="sm" onClick={clearAll} className="gap-1.5 text-muted-foreground">
                <X className="h-3.5 w-3.5" />
                Clear all
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Active Filter Pills */}
      <AnimatePresence>
        {hasFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap gap-2"
          >
            {activeQ && (
              <Badge variant="outline" className="gap-1.5 pl-2">
                &ldquo;{activeQ}&rdquo;
                <button onClick={() => { setQuery(""); updateParam("q", null); }}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {activeCategory && (
              <Badge variant="outline" className="gap-1.5 pl-2 capitalize">
                {capitalize(activeCategory)}
                <button onClick={() => updateParam("category", null)}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {activeSort && (
              <Badge variant="outline" className="gap-1.5 pl-2">
                {activeSort}
                <button onClick={() => updateParam("sort", null)}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
