// src/store/useCartStore.ts
import { create } from 'zustand';
import { FoodItemWithVendor } from '@/components/AddToCartButton';

// 1. We extend our new dynamic type, adding 'quantity' to it
export interface CartItem extends FoodItemWithVendor {
  quantity: number;
}

// 2. Define the shape of our Store
interface CartState {
  items: CartItem[];
  addItem: (item: FoodItemWithVendor) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  
  // THE FIX: Re-adding the missing helper functions!
  getItemCount: () => number;
  getTotalPrice: () => number;
}

// 3. Build the actual Zustand Store
export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  
  addItem: (item) => 
    set((state) => {
      const existingItem = state.items.find((i) => i.id === item.id);
      
      if (existingItem) {
        return {
          items: state.items.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return { items: [...state.items, { ...item, quantity: 1 }] };
    }),

  removeItem: (itemId) =>
    set((state) => ({
      items: state.items.filter((i) => i.id !== itemId),
    })),

  clearCart: () => set({ items: [] }),

  // THE FIX: The logic to calculate totals
  getItemCount: () => {
    // get() lets us look at the current items in the store
    const { items } = get();
    return items.reduce((total, item) => total + item.quantity, 0);
  },

  getTotalPrice: () => {
    const { items } = get();
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }
}));