"use client";

import { useRef, useEffect, useCallback } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { fetchProducts } from "@/lib/api";
import { ProductCard } from "@/components/product-card";
import { ProductCardSkeleton } from "@/components/product-skeleton";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import type { SortOption } from "@/types";

const LIMIT = 12;

interface InfiniteProductGridProps {
  q?: string;
  category?: string;
  sort?: SortOption;
}

function sortProducts(products: any[], sort: SortOption) {
  const sorted = [...products];
  switch (sort) {
    case "price-asc":
      return sorted.sort((a, b) => a.price - b.price);
    case "price-desc":
      return sorted.sort((a, b) => b.price - a.price);
    case "rating":
      return sorted.sort((a, b) => b.rating - a.rating);
    case "discount":
      return sorted.sort((a, b) => b.discountPercentage - a.discountPercentage);
    default:
      return sorted;
  }
}

export function InfiniteProductGrid({
  q = "",
  category = "",
  sort = "default",
}: InfiniteProductGridProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const entry = useIntersectionObserver(sentinelRef, { threshold: 0.1 });

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ["products", { q, category }],
    queryFn: ({ pageParam = 0 }) =>
      fetchProducts({ limit: LIMIT, skip: pageParam, q, category }),
    getNextPageParam: (lastPage) => {
      const nextSkip = lastPage.skip + lastPage.limit;
      return nextSkip < lastPage.total ? nextSkip : undefined;
    },
    initialPageParam: 0,
  });

  // Trigger fetch when sentinel is visible
  useEffect(() => {
    if (entry?.isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [entry?.isIntersecting, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-5xl mb-4">⚠️</p>
        <h3 className="font-semibold text-lg mb-1">Failed to load products</h3>
        <p className="text-muted-foreground text-sm">Please check your connection and try again.</p>
      </div>
    );
  }

  const allProducts = data?.pages.flatMap((p) => p.products) ?? [];
  const sorted = sortProducts(allProducts, sort);

  if (sorted.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-5xl mb-4">🔍</p>
        <h3 className="font-semibold text-lg mb-1">No products found</h3>
        <p className="text-muted-foreground text-sm">Try a different search or category.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {sorted.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </motion.div>

      {/* Infinite scroll sentinel */}
      <div ref={sentinelRef} className="flex justify-center py-4">
        {isFetchingNextPage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-muted-foreground text-sm"
          >
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading more...
          </motion.div>
        )}
        {!hasNextPage && allProducts.length > 0 && (
          <p className="text-muted-foreground text-sm">
            You&apos;ve seen all {allProducts.length} products
          </p>
        )}
      </div>
    </div>
  );
}
