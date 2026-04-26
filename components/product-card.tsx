"use client";

import Link from "next/link";
import { Heart, ShoppingCart, Star, Check, BadgePercent } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { formatPrice, capitalize } from "@/lib/utils";
import { getDiscountedPrice } from "@/lib/api";
import { ClientImage } from "@/components/client-image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addItem, isInCart } = useCart();
  const { toggleItem, isWishlisted } = useWishlist();

  const inCart = isInCart(product.id);
  const wishlisted = isWishlisted(product.id);
  const discountedPrice = getDiscountedPrice(product.price, product.discountPercentage);
  const hasDiscount = product.discountPercentage > 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      thumbnail: product.thumbnail,
      discountPercentage: product.discountPercentage,
    });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleItem({
      id: product.id,
      title: product.title,
      price: product.price,
      thumbnail: product.thumbnail,
      rating: product.rating,
      discountPercentage: product.discountPercentage,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -4 }}
    >
      <Link href={`/products/${product.id}`} className="block group">
        <div className="rounded-2xl border bg-card overflow-hidden hover:shadow-lg hover:shadow-primary/5 transition-shadow duration-300">
          {/* Image Container */}
          <div className="relative w-full h-[260px] bg-muted overflow-hidden">
            <ClientImage
              src={product.thumbnail}
              alt={product.title}
              productId={product.id}
              className="transition-transform duration-500 group-hover:scale-110"
            />

            {/* Discount Badge */}
            {hasDiscount && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="absolute top-3 left-3"
              >
                <Badge className="bg-rose-500 hover:bg-rose-500 gap-1">
                  <BadgePercent className="h-3 w-3" />
                  {Math.round(product.discountPercentage)}% OFF
                </Badge>
              </motion.div>
            )}

            {/* Wishlist Button */}
            <button
              onClick={handleWishlist}
              className={cn(
                "absolute top-3 right-3 p-2 rounded-full transition-all duration-200",
                "bg-background/80 backdrop-blur-sm hover:bg-background",
                wishlisted ? "text-rose-500" : "text-muted-foreground hover:text-rose-500"
              )}
              aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              <motion.div
                animate={{ scale: wishlisted ? [1, 1.3, 1] : 1 }}
                transition={{ duration: 0.3 }}
              >
                <Heart className={cn("h-4 w-4", wishlisted && "fill-current")} />
              </motion.div>
            </button>
          </div>

          {/* Content */}
          <div className="p-4 space-y-3">
            <div>
              <p className="text-xs text-muted-foreground capitalize mb-1">
                {capitalize(product.category)}
              </p>
              <h3 className="font-semibold text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                {product.title}
              </h3>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1.5">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-3 w-3",
                      i < Math.round(product.rating)
                        ? "text-amber-400 fill-amber-400"
                        : "text-muted-foreground/30"
                    )}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">
                {product.rating.toFixed(1)}
              </span>
            </div>

            {/* Price + CTA */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex flex-col">
                <span className="font-bold text-base">
                  {formatPrice(discountedPrice)}
                </span>
                {hasDiscount && (
                  <span className="text-xs text-muted-foreground line-through">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>

              <motion.button
                onClick={handleAddToCart}
                whileTap={{ scale: 0.9 }}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200",
                  inCart
                    ? "bg-green-500/10 text-green-600 border border-green-500/20"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                )}
                aria-label={inCart ? "Added to cart" : "Add to cart"}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={inCart ? "check" : "cart"}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    {inCart ? (
                      <Check className="h-3.5 w-3.5" />
                    ) : (
                      <ShoppingCart className="h-3.5 w-3.5" />
                    )}
                  </motion.div>
                </AnimatePresence>
                {inCart ? "Added" : "Add"}
              </motion.button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
