import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import { CartItem } from "@/types";
import { getDiscountedPrice } from "@/lib/api";

interface CartStore {
  items: CartItem[];

  // Actions
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;

  // Selectors
  totalItems: () => number;
  totalPrice: () => number;
  isInCart: (id: number) => boolean;
}

export const useCart = create<CartStore>()(
  devtools(
    persist(
      (set, get) => ({
        items: [],

        addItem: (newItem) => {
          set((state) => {
            const existing = state.items.find((i) => i.id === newItem.id);
            if (existing) {
              return {
                items: state.items.map((i) =>
                  i.id === newItem.id
                    ? { ...i, quantity: Math.min(i.quantity + 1, 10) }
                    : i
                ),
              };
            }
            return { items: [...state.items, { ...newItem, quantity: 1 }] };
          });
        },

        removeItem: (id) =>
          set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

        updateQuantity: (id, quantity) => {
          if (quantity <= 0) {
            get().removeItem(id);
            return;
          }
          set((state) => ({
            items: state.items.map((i) =>
              i.id === id ? { ...i, quantity: Math.min(quantity, 10) } : i
            ),
          }));
        },

        clearCart: () => set({ items: [] }),

        totalItems: () =>
          get().items.reduce((sum, item) => sum + item.quantity, 0),

        totalPrice: () =>
          get().items.reduce((sum, item) => {
            const discounted = getDiscountedPrice(item.price, item.discountPercentage);
            return sum + discounted * item.quantity;
          }, 0),

        isInCart: (id) => get().items.some((i) => i.id === id),
      }),
      { name: "ds-cart" }
    ),
    { name: "CartStore" }
  )
);
