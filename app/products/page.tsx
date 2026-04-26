import { Suspense } from "react";
import { fetchCategories } from "@/lib/api";
import { SearchFilters } from "@/components/search-filters";
import { InfiniteProductGrid } from "@/components/infinite-product-grid";
import { ProductGridSkeleton } from "@/components/product-skeleton";
import type { SortOption } from "@/types";

interface ProductsPageProps {
  searchParams: { q?: string; category?: string; sort?: string };
}

export const metadata = {
  title: "Products",
  description: "Browse all products with search and filters",
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const categories = await fetchCategories();
  const { q = "", category = "", sort = "default" } = searchParams;

  return (
    <div className="container px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">All Products</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Real data from DummyJSON API · Infinite scroll · Debounced search
        </p>
      </div>

      <Suspense fallback={null}>
        <SearchFilters categories={categories} />
      </Suspense>

      <div className="mt-8">
        <Suspense fallback={<ProductGridSkeleton />}>
          <InfiniteProductGrid q={q} category={category} sort={sort as SortOption} />
        </Suspense>
      </div>
    </div>
  );
}
