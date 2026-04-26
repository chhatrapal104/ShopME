import { notFound } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";
import { Star, ShieldCheck, Truck, RotateCcw, Package, BadgePercent } from "lucide-react";
import { fetchProductById, fetchRelatedProducts, getDiscountedPrice } from "@/lib/api";
import { formatPrice, capitalize } from "@/lib/utils";
import { ProductCard } from "@/components/product-card";
import { AddToCartSection } from "@/components/add-to-cart-section";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface ProductPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  try {
    const product = await fetchProductById(Number(params.slug));
    return {
      title: product.title,
      description: product.description,
      openGraph: { images: [product.thumbnail] },
    };
  } catch {
    return { title: "Product Not Found" };
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const id = Number(params.slug);
  if (isNaN(id)) notFound();

  let product;
  try {
    product = await fetchProductById(id);
  } catch {
    notFound();
  }

  const related = await fetchRelatedProducts(product.category, product.id);
  const discountedPrice = getDiscountedPrice(product.price, product.discountPercentage);
  const savings = product.price - discountedPrice;

  return (
    <div className="container px-4 py-10">
      {/* ── Main Product ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Image Gallery */}
        <div className="space-y-3">
          <div className="relative aspect-square rounded-2xl overflow-hidden border bg-muted">
            <Image
              src={product.images[0] ?? product.thumbnail}
              alt={product.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            {product.discountPercentage > 0 && (
              <div className="absolute top-4 left-4">
                <Badge className="bg-rose-500 hover:bg-rose-500 gap-1 text-sm px-2.5 py-1">
                  <BadgePercent className="h-3.5 w-3.5" />
                  {Math.round(product.discountPercentage)}% OFF
                </Badge>
              </div>
            )}
          </div>

          {/* Thumbnail Row */}
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.slice(0, 4).map((img, i) => (
                <div key={i} className="relative aspect-square rounded-lg overflow-hidden border bg-muted">
                  <Image src={img} alt={`${product.title} view ${i + 1}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col gap-5">
          {/* Category + Brand */}
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="capitalize">{capitalize(product.category)}</Badge>
            {product.brand && <Badge variant="outline">{product.brand}</Badge>}
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold leading-tight">{product.title}</h1>

          {/* Rating */}
          <div className="flex items-center gap-3">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.round(product.rating)
                      ? "text-amber-400 fill-amber-400"
                      : "text-muted-foreground/30"
                  }`}
                />
              ))}
            </div>
            <span className="font-semibold">{product.rating.toFixed(1)}</span>
            <span className="text-muted-foreground text-sm">
              · {product.stock} in stock
            </span>
          </div>

          <Separator />

          {/* Description */}
          <p className="text-muted-foreground leading-relaxed">{product.description}</p>

          {/* Tags */}
          {product.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {product.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs capitalize">{tag}</Badge>
              ))}
            </div>
          )}

          <Separator />

          {/* Pricing */}
          <div className="space-y-1">
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold">{formatPrice(discountedPrice)}</span>
              {product.discountPercentage > 0 && (
                <span className="text-xl text-muted-foreground line-through">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>
            {savings > 0 && (
              <p className="text-green-600 text-sm font-medium">
                You save {formatPrice(savings)} ({Math.round(product.discountPercentage)}% off)
              </p>
            )}
          </div>

          {/* Add to Cart (Client Component) */}
          <AddToCartSection product={product} />

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-3 pt-1">
            {[
              { icon: <Truck className="h-4 w-4" />, label: "Free Delivery" },
              { icon: <RotateCcw className="h-4 w-4" />, label: "30-Day Returns" },
              { icon: <ShieldCheck className="h-4 w-4" />, label: "2-Year Warranty" },
            ].map((b) => (
              <div key={b.label} className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-muted/50 text-center">
                <span className="text-primary">{b.icon}</span>
                <span className="text-xs font-medium">{b.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Related Products ── */}
      {related.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
