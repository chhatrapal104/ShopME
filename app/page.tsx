import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Zap, Star, ShieldCheck, Truck } from "lucide-react";
import { fetchFeaturedProducts, fetchCategories, getDiscountedPrice } from "@/lib/api";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { capitalize, formatPrice } from "@/lib/utils";

export default async function HomePage() {
  const [products, categories] = await Promise.all([
    fetchFeaturedProducts(),
    fetchCategories(),
  ]);

  const topCategories = categories.slice(0, 6);

  return (
    <div className="flex flex-col gap-0">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/20 via-background to-background">
        {/* Background blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container px-4 py-24 md:py-32 relative">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border bg-background/60 backdrop-blur-sm text-sm font-medium">
              <Zap className="h-3.5 w-3.5 text-primary" />
              100+ products from DummyJSON API
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1]">
              Shop Smarter,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">
                Live Better
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto">
              Discover thousands of products with real-time search, infinite scroll,
              and a buttery-smooth shopping experience.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Link href="/products">
                <Button size="lg" className="gap-2 px-8 text-base h-12">
                  Shop Now
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/products?sort=discount">
                <Button size="lg" variant="outline" className="gap-2 px-8 text-base h-12">
                  Today&apos;s Deals
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust Badges ── */}
      <section className="border-y bg-muted/30 py-5">
        <div className="container px-4">
          <div className="flex flex-wrap justify-center gap-8 text-sm">
            {[
              { icon: <Truck className="h-4 w-4" />, label: "Free shipping over $50" },
              { icon: <ShieldCheck className="h-4 w-4" />, label: "Secure checkout" },
              { icon: <Star className="h-4 w-4" />, label: "4.8★ avg product rating" },
              { icon: <Zap className="h-4 w-4" />, label: "Instant search" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2 text-muted-foreground">
                <span className="text-primary">{item.icon}</span>
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="container px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Browse Categories</h2>
          <Link href="/products">
            <Button variant="ghost" size="sm" className="gap-1">
              See all <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {topCategories.map((cat) => (
            <Link key={cat} href={`/products?category=${cat}`}>
              <div className="flex flex-col items-center gap-2 p-4 rounded-xl border bg-card hover:bg-primary/5 hover:border-primary/30 transition-all duration-200 cursor-pointer group text-center">
                <span className="text-2xl">
                  {categoryEmoji(cat)}
                </span>
                <span className="text-xs font-medium capitalize group-hover:text-primary transition-colors">
                  {capitalize(cat)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section className="bg-muted/20 py-16">
        <div className="container px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold">Featured Products</h2>
              <p className="text-muted-foreground text-sm mt-1">Handpicked for you</p>
            </div>
            <Link href="/products">
              <Button variant="outline" size="sm" className="gap-1">
                View all <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(0, 8).map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="container px-4 py-16">
        <div className="rounded-2xl bg-gradient-to-r from-primary to-purple-500 p-10 text-primary-foreground text-center space-y-4">
          <h2 className="text-3xl font-bold">Ready to find your next favorite?</h2>
          <p className="text-primary-foreground/80">
            Browse our full catalog with smart filters and instant search.
          </p>
          <Link href="/products">
            <Button size="lg" variant="secondary" className="mt-2 gap-2">
              Explore All Products
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

function categoryEmoji(category: string): string {
  const map: Record<string, string> = {
    smartphones: "📱",
    laptops: "💻",
    fragrances: "🌸",
    skincare: "✨",
    groceries: "🛒",
    "home-decoration": "🏠",
    furniture: "🪑",
    tops: "👕",
    "womens-dresses": "👗",
    "womens-shoes": "👠",
    "mens-shoes": "👟",
    "mens-watches": "⌚",
    "womens-watches": "⌚",
    "womens-bags": "👜",
    "womens-jewellery": "💍",
    sunglasses: "🕶️",
    automotive: "🚗",
    motorcycle: "🏍️",
    lighting: "💡",
  };
  return map[category] ?? "📦";
}
