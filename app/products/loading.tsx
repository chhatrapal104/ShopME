import { ProductGridSkeleton } from "@/components/product-skeleton";

export default function ProductsLoading() {
  return (
    <div className="container px-4 py-10">
      <div className="mb-8 space-y-2">
        <div className="h-8 w-40 bg-muted animate-pulse rounded-md" />
        <div className="h-4 w-64 bg-muted animate-pulse rounded-md" />
      </div>
      <div className="mb-8 space-y-4">
        <div className="h-10 w-full bg-muted animate-pulse rounded-md" />
        <div className="flex gap-3">
          <div className="h-9 w-44 bg-muted animate-pulse rounded-md" />
          <div className="h-9 w-44 bg-muted animate-pulse rounded-md" />
        </div>
      </div>
      <ProductGridSkeleton count={8} />
    </div>
  );
}
