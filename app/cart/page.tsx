"use client";

import Link from "next/link";
import { ClientImage } from "@/components/client-image";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, ShoppingBag, ArrowLeft, Minus, Plus, ArrowRight } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/utils";
import { getDiscountedPrice } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCart();

  const subtotal = totalPrice();
  const shipping = subtotal > 50 ? 0 : 5.99;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="container px-4 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground" />
          <h2 className="text-2xl font-bold">Your cart is empty</h2>
          <p className="text-muted-foreground">Add some products and come back!</p>
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
        <h1 className="text-3xl font-bold">Shopping Cart</h1>
        <Button variant="ghost" size="sm" onClick={clearCart} className="text-muted-foreground">
          Clear cart
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-3">
          <AnimatePresence initial={false}>
            {items.map((item) => {
              const discounted = getDiscountedPrice(item.price, item.discountPercentage);
              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="flex items-center gap-4 p-4 rounded-xl border bg-card"
                >
                  <Link href={`/products/${item.id}`}>
                    <div className="h-20 w-20 rounded-lg overflow-hidden bg-muted shrink-0">
                      <ClientImage src={item.thumbnail} alt={item.title} productId={item.id} />
                    </div>
                  </Link>

                  <div className="flex-1 min-w-0">
                    <Link href={`/products/${item.id}`}>
                      <p className="font-medium truncate hover:text-primary transition-colors">
                        {item.title}
                      </p>
                    </Link>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {formatPrice(discounted)} each
                    </p>
                  </div>

                  <div className="flex items-center gap-2 border rounded-lg overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1.5 hover:bg-muted transition-colors"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1.5 hover:bg-muted transition-colors"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>

                  <span className="font-bold min-w-[60px] text-right">
                    {formatPrice(discounted * item.quantity)}
                  </span>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(item.id)}
                    className="text-muted-foreground hover:text-destructive shrink-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="rounded-xl border bg-card p-6 space-y-4 sticky top-24">
            <h2 className="text-lg font-bold">Order Summary</h2>
            <Separator />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className={shipping === 0 ? "text-green-600 font-medium" : ""}>
                  {shipping === 0 ? "FREE" : formatPrice(shipping)}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-muted-foreground">
                  Add {formatPrice(50 - subtotal)} more for free shipping
                </p>
              )}
            </div>

            <Separator />

            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>

            <Button size="lg" className="w-full gap-2">
              Proceed to Checkout
              <ArrowRight className="h-4 w-4" />
            </Button>

            <Link href="/products">
              <Button variant="ghost" className="w-full gap-2 text-muted-foreground">
                <ArrowLeft className="h-4 w-4" />
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
