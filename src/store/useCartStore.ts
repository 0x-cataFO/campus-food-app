import { create } from 'zustand';

// Define the shape of a Cart Item
export interface CartItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  vendorId: string;
  quantity: number;
}

// Define the shape of our entire Store
interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

// Create the Zustand Store
export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  
  // Adds an item or increases its quantity if it's already in the cart
  addItem: (item) => {
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
    });
  },
  
  // Completely removes an item
  removeItem: (id) => {
    set((state) => ({
      items: state.items.filter((i) => i.id !== id),
    }));
  },
  
  // Wipes the cart clean (used after checkout)
  clearCart: () => set({ items: [] }),
  
  // Calculates the total price in Naira
  getTotal: () => get().items.reduce((total, item) => total + (item.price * item.quantity), 0),
  
  // Calculates how many total items are in the cart
  getItemCount: () => get().items.reduce((count, item) => count + item.quantity, 0),
}));