"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Trash2, ShoppingCart, ArrowLeft } from "lucide-react";
import { useWishlist } from "@/hooks/use-wishlist";
import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/utils";
import { getDiscountedPrice } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function WishlistPage() {
  const { items, removeItem, clearWishlist } = useWishlist();
  const { addItem, isInCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="container px-4 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <Heart className="h-16 w-16 mx-auto text-muted-foreground" />
          <h2 className="text-2xl font-bold">Your wishlist is empty</h2>
          <p className="text-muted-foreground">
            Save products you love by clicking the heart icon.
          </p>
          <Link href="/products">
            <Button size="lg" className="mt-2 gap-2">
              <ArrowLeft className="h-4 w-4" />
              Browse Products
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Wishlist</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {items.length} saved item{items.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearWishlist}
          className="text-muted-foreground"
        >
          Clear all
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence initial={false}>
          {items.map((item, index) => {
            const discounted = getDiscountedPrice(item.price, item.discountPercentage);
            const inCart = isInCart(item.id);

            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2, delay: index * 0.04 }}
              >
                <Link href={`/products/${item.id}`} className="block group">
                  <div className="rounded-2xl border bg-card overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    {/* Image */}
                    <div className="aspect-square bg-muted overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {item.discountPercentage > 0 && (
                        <Badge className="absolute top-3 left-3 bg-rose-500 hover:bg-rose-500">
                          -{Math.round(item.discountPercentage)}%
                        </Badge>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4 space-y-3">
                      <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>

                      {/* Stars */}
                      <div className="flex items-center gap-1">
                        {"★"
                          .repeat(Math.round(item.rating))
                          .split("")
                          .map((_, i) => (
                            <span key={i} className="text-amber-400 text-xs">★</span>
                          ))}
                        <span className="text-xs text-muted-foreground ml-1">
                          {item.rating.toFixed(1)}
                        </span>
                      </div>

                      {/* Price */}
                      <div className="flex items-baseline gap-2">
                        <span className="font-bold">{formatPrice(discounted)}</span>
                        {item.discountPercentage > 0 && (
                          <span className="text-xs text-muted-foreground line-through">
                            {formatPrice(item.price)}
                          </span>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-1">
                        <Button
                          size="sm"
                          className="flex-1 gap-1.5 text-xs"
                          variant={inCart ? "secondary" : "default"}
                          onClick={(e) => {
                            e.preventDefault();
                            if (!inCart) {
                              addItem({
                                id: item.id,
                                title: item.title,
                                price: item.price,
                                thumbnail: item.thumbnail,
                                discountPercentage: item.discountPercentage,
                              });
                            }
                          }}
                        >
                          <ShoppingCart className="h-3.5 w-3.5" />
                          {inCart ? "In Cart" : "Add to Cart"}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-muted-foreground hover:text-destructive"
                          onClick={(e) => {
                            e.preventDefault();
                            removeItem(item.id);
                          }}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
