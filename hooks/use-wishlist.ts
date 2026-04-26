import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import { WishlistItem } from "@/types";

interface WishlistStore {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (id: number) => void;
  toggleItem: (item: WishlistItem) => void;
  isWishlisted: (id: number) => boolean;
  clearWishlist: () => void;
}

export const useWishlist = create<WishlistStore>()(
  devtools(
    persist(
      (set, get) => ({
        items: [],

        addItem: (item) => {
          if (!get().isWishlisted(item.id)) {
            set((state) => ({ items: [...state.items, item] }));
          }
        },

        removeItem: (id) =>
          set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

        toggleItem: (item) => {
          if (get().isWishlisted(item.id)) {
            get().removeItem(item.id);
          } else {
            get().addItem(item);
          }
        },

        isWishlisted: (id) => get().items.some((i) => i.id === id),

        clearWishlist: () => set({ items: [] }),
      }),
      { name: "ds-wishlist" }
    ),
    { name: "WishlistStore" }
  )
);
