import { Product, ProductsResponse } from "@/types";

const BASE_URL = "https://dummyjson.com";

// ─── Reliable image URLs via picsum.photos ────────────────────────────────────
// DummyJSON's CDN (cdn.dummyjson.com / i.dummyjson.com) is unreliable on Vercel.
// We replace every product's images with picsum.photos seeded by product ID so
// each product always gets the same image, consistently, on every environment.
function getReliableImage(productId: number, variant = 0): string {
  return `https://picsum.photos/seed/sw-${productId}-${variant}/400/400`;
}

function enhanceProduct(product: Product): Product {
  return {
    ...product,
    thumbnail: getReliableImage(product.id),
    images: Array.from({ length: 4 }, (_, i) => getReliableImage(product.id, i)),
  };
}

function enhanceProducts(products: Product[]): Product[] {
  return products.map(enhanceProduct);
}

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
  const data: ProductsResponse = await res.json();
  return { ...data, products: enhanceProducts(data.products) };
}

export async function fetchProductById(id: number): Promise<Product> {
  const res = await fetch(`${BASE_URL}/products/${id}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error("Product not found");
  const product: Product = await res.json();
  return enhanceProduct(product);
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
  return enhanceProducts(data.products);
}

export async function fetchRelatedProducts(category: string, excludeId: number): Promise<Product[]> {
  const data = await fetchProducts({ category, limit: 4 });
  return data.products.filter((p) => p.id !== excludeId);
}

// ─── Utility ──────────────────────────────────────────────────────────────────

export function getDiscountedPrice(price: number, discountPercentage: number): number {
  return price - (price * discountPercentage) / 100;
}
