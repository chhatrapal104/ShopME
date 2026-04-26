"use client";

import { useState } from "react";
import { ShoppingCart, Check, Heart, Minus, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

export function AddToCartSection({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const { addItem, isInCart, items, updateQuantity } = useCart();
  const { toggleItem, isWishlisted } = useWishlist();

  const inCart = isInCart(product.id);
  const wishlisted = isWishlisted(product.id);
  const cartItem = items.find((i) => i.id === product.id);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        title: product.title,
        price: product.price,
        thumbnail: product.thumbnail,
        discountPercentage: product.discountPercentage,
      });
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Quantity Selector */}
      {!inCart && (
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-muted-foreground">Qty:</span>
          <div className="flex items-center gap-2 border rounded-lg overflow-hidden">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="p-2 hover:bg-muted transition-colors"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="w-8 text-center text-sm font-semibold">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
              className="p-2 hover:bg-muted transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* In-cart quantity adjuster */}
      {inCart && cartItem && (
        <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/5 border border-primary/20">
          <Check className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium flex-1">In your cart</span>
          <div className="flex items-center gap-2 border rounded-lg overflow-hidden bg-background">
            <button
              onClick={() => updateQuantity(product.id, cartItem.quantity - 1)}
              className="p-1.5 hover:bg-muted transition-colors"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="w-6 text-center text-sm font-semibold">{cartItem.quantity}</span>
            <button
              onClick={() => updateQuantity(product.id, cartItem.quantity + 1)}
              className="p-1.5 hover:bg-muted transition-colors"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
        </div>
      )}

      {/* CTA Buttons */}
      <div className="flex gap-3">
        <motion.div className="flex-1" whileTap={{ scale: 0.98 }}>
          <Button
            size="lg"
            className="w-full gap-2 text-base"
            onClick={handleAddToCart}
            disabled={inCart}
            variant={inCart ? "secondary" : "default"}
          >
            <AnimatePresence mode="wait">
              {inCart ? (
                <motion.span
                  key="check"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2"
                >
                  <Check className="h-5 w-5" />
                  Added to Cart
                </motion.span>
              ) : (
                <motion.span
                  key="add"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2"
                >
                  <ShoppingCart className="h-5 w-5" />
                  Add to Cart
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        </motion.div>

        <Button
          size="lg"
          variant="outline"
          className={cn("gap-2", wishlisted && "border-rose-500 text-rose-500")}
          onClick={() =>
            toggleItem({
              id: product.id,
              title: product.title,
              price: product.price,
              thumbnail: product.thumbnail,
              rating: product.rating,
              discountPercentage: product.discountPercentage,
            })
          }
        >
          <Heart className={cn("h-5 w-5", wishlisted && "fill-current")} />
        </Button>
      </div>
    </div>
  );
}
