// src/components/AddToCartButton.tsx
"use client";

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/useCartStore"; // Adjust this import path if your store is somewhere else!
import { ShoppingCart } from "lucide-react";

export type FoodItemWithVendor = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  vendorId: string;
  isAvailable: boolean;
  vendor: {
    id: string;
    userId: string;
    storeName: string;
    location: string;
    isOpen: boolean;
  };
};

export default function AddToCartButton({ item }: { item: FoodItemWithVendor }) {
  // Grab the addItem function from your Zustand store
  const addItem = useCartStore((state) => state.addItem);

  return (
    <Button 
      onClick={() => addItem(item)}
      className="w-full bg-[#FFD100] text-black hover:bg-[#E6BC00] rounded-full font-bold transition-transform active:scale-95"
    >
      <ShoppingCart className="w-4 h-4 mr-2" />
      Add to Cart
    </Button>
  );
}