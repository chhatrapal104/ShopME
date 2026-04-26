import { Product, ProductsResponse } from "@/types";

const BASE_URL = "https://dummyjson.com";

// ─── Products ─────────────────────────────────────────────────────────────────

export async function fetchProducts(params?: {
  limit?: number;
  skip?: number;
  q?: string;
  category?: string;
}): Promise<ProductsResponse> {
  const { limit = 12, skip = 0, q, category } = params ?? {};

  let url: string;

  if (q) {
    url = `${BASE_URL}/products/search?q=${encodeURIComponent(q)}&limit=${limit}&skip=${skip}`;
  } else if (category) {
    url = `${BASE_URL}/products/category/${encodeURIComponent(category)}?limit=${limit}&skip=${skip}`;
  } else {
    url = `${BASE_URL}/products?limit=${limit}&skip=${skip}`;
  }

  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export async function fetchProductById(id: number): Promise<Product> {
  const res = await fetch(`${BASE_URL}/products/${id}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error("Product not found");
  return res.json();
}

export async function fetchCategories(): Promise<string[]> {
  const res = await fetch(`${BASE_URL}/products/category-list`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
}

export async function fetchFeaturedProducts(): Promise<Product[]> {
  const res = await fetch(`${BASE_URL}/products?limit=8&skip=0&select=id,title,price,rating,thumbnail,category,discountPercentage`, {
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error("Failed to fetch featured products");
  const data: ProductsResponse = await res.json();
  return data.products;
}

export async function fetchRelatedProducts(category: string, excludeId: number): Promise<Product[]> {
  const data = await fetchProducts({ category, limit: 4 });
  return data.products.filter((p) => p.id !== excludeId);
}

// ─── Utility ──────────────────────────────────────────────────────────────────

export function getDiscountedPrice(price: number, discountPercentage: number): number {
  return price - (price * discountPercentage) / 100;
}
