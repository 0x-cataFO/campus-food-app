// src/components/AddToCartButton.tsx
"use client";

import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";

// We pass the required food details in as props
interface AddToCartButtonProps {
  food: {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
    vendorId: string;
  }
}

export default function AddToCartButton({ food }: AddToCartButtonProps) {
  // Pull the addItem function from our Zustand store
  const addItem = useCartStore((state) => state.addItem);

  return (
    <Button 
      onClick={() => addItem({
        id: food.id,
        name: food.name,
        price: food.price,
        imageUrl: food.imageUrl,
        vendorId: food.vendorId
      })}
      className="rounded-full px-6 bg-slate-900 text-white hover:bg-slate-800 flex items-center gap-2 transition-transform active:scale-95"
    >
      <ShoppingCart className="w-4 h-4" /> Add
    </Button>
  );
}