// ─── Product ────────────────────────────────────────────────────────────────
export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
  tags: string[];
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

// ─── Cart ────────────────────────────────────────────────────────────────────
export interface CartItem {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  quantity: number;
  discountPercentage: number;
}

// ─── Wishlist ─────────────────────────────────────────────────────────────────
export interface WishlistItem {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  rating: number;
  discountPercentage: number;
}

// ─── Filters ──────────────────────────────────────────────────────────────────
export type SortOption =
  | "default"
  | "price-asc"
  | "price-desc"
  | "rating"
  | "discount";

export interface Filters {
  q: string;
  category: string;
  sort: SortOption;
  minPrice: number;
  maxPrice: number;
}
