// src/components/CartDrawer.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Trash2, Loader2 } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { processCheckout } from "@/app/actions/order";

export default function CartDrawer() {
  // Global State (Zustand)
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const itemCount = useCartStore((state) => state.getItemCount());
  const clearCart = useCartStore((state) => state.clearCart);

  // THE FIX: Calculate the total directly here so React guarantees a re-render!
  const cartTotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);

  // Local State & Routing
  const router = useRouter();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Checkout Handler
  async function handleCheckout() {
    setIsCheckingOut(true);
    
    const result = await processCheckout(items);
    
    if (result.success) {
      clearCart(); 
      router.push("/success"); 
    } else {
      alert(result.error); 
      setIsCheckingOut(false);
    }
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        {/* The Cart Button (Mobile Optimized) */}
        <Button variant="outline" className="relative rounded-full font-semibold px-5 h-10 border-slate-200 hover:bg-slate-50">
          <ShoppingBag className="w-4 h-4 sm:mr-2" />
          <span className="hidden sm:inline">Cart</span>
          
          {/* Notification Bubble */}
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-in zoom-in">
              {itemCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      
      {/* Sheet Content */}
      <SheetContent className="w-full sm:max-w-md bg-white flex flex-col h-full p-0 border-l">
        
        {/* Accessible Header */}
        <SheetHeader className="text-left border-b px-6 py-5 bg-white z-10">
          <SheetTitle className="text-2xl font-black tracking-tight">Your Order</SheetTitle>
          <SheetDescription>Review your items before checkout.</SheetDescription>
        </SheetHeader>

        {/* Scrolling Cart Body */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-4 bg-slate-50/50">
          {items.length === 0 ? (
            /* Empty State */
            <div className="text-center text-slate-500 mt-20 flex flex-col items-center">
              <ShoppingBag className="w-16 h-16 mb-4 text-slate-200" />
              <p className="font-medium text-lg text-slate-900">Your cart is empty</p>
              <p className="text-sm">Add some delicious meals to get started.</p>
            </div>
          ) : (
            /* Populated Cart (Mobile Optimized) */
            items.map((item) => (
              <div key={item.id} className="flex gap-3 sm:gap-4 items-center bg-white p-3 sm:p-4 rounded-2xl border shadow-sm">
                
                {/* Food Image */}
                <div 
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-cover bg-center border shrink-0"
                  style={{ backgroundImage: `url(${item.imageUrl})` }}
                />
                
                {/* Text Content */}
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <h4 className="font-bold text-sm sm:text-base line-clamp-2 sm:line-clamp-1 leading-tight mb-1">
                    {item.name}
                  </h4>
                  
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                    <span className="font-black text-sm sm:text-base text-slate-900">
                      ₦{(item.price * item.quantity).toLocaleString()}
                    </span>
                    <span className="text-slate-400 text-xs sm:text-sm font-medium">
                      (₦{item.price.toLocaleString()} x {item.quantity})
                    </span>
                  </div>
                </div>

                {/* Delete Button */}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => removeItem(item.id)} 
                  disabled={isCheckingOut}
                  className="text-red-500 hover:bg-red-50 hover:text-red-600 h-8 w-8 rounded-full shrink-0 sm:ml-2"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))
          )}
        </div>

        {/* Footer (Fixed to bottom) */}
        <div className="border-t px-6 py-6 bg-white z-10">
          <div className="flex justify-between items-end mb-6">
            <span className="text-slate-500 font-medium text-lg">Total</span>
            {/* THE FIX: We inject the new highly-reactive cartTotal variable here */}
            <span className="font-black text-3xl">₦{cartTotal.toLocaleString()}</span>
          </div>
          
          {/* Checkout Action Button */}
          <Button 
            onClick={handleCheckout}
            disabled={items.length === 0 || isCheckingOut}
            className="w-full h-14 text-lg font-bold bg-[#FFD100] text-black hover:bg-[#E6BC00] rounded-full shadow-lg transition-transform active:scale-95 disabled:opacity-50 flex items-center justify-center" 
          >
            {isCheckingOut ? (
              <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Processing...</>
            ) : (
              "Go to Checkout"
            )}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}