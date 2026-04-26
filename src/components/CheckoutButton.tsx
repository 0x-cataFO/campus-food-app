// src/components/CheckoutButton.tsx
"use client";

import { useState } from "react";
import { PaystackButton } from "react-paystack"; // THE FIX: Importing the Component instead of the Hook!
import { useCartStore } from "@/store/useCartStore"; 
import { processSuccessfulPayment } from "@/app/actions/order";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function CheckoutButton({ email, closeCart }: { email: string, closeCart: () => void }) {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [isSaving, setIsSaving] = useState(false); 
  const router = useRouter();
  
  const totalNaira = getTotalPrice();
  const amountInKobo = Math.round(totalNaira * 100); 

  // 1. What happens when Paystack says "Success!"
  const handleSuccess = async (reference: any) => {
    console.log("🟢 PAYSTACK SUCCESS CALLED!", reference); // Let's keep the tracker!
    setIsSaving(true);
    
    try {
      await processSuccessfulPayment(items, reference.reference);
      clearCart();
      closeCart(); 
      alert("Payment Successful! Your order has been sent to the vendor.");
      router.push("/profile"); 
    } catch (error) {
      console.error("🔴 DATABASE SAVE FAILED:", error);
      alert("Payment went through, but we had trouble saving the order. Check the console!");
      setIsSaving(false);
    }
  };

  // 2. What happens if they just close the window
  const handleClose = () => {
    console.log("🟡 User closed the Paystack modal.");
  };

  if (items.length === 0) return null;

  // 3. We pack all our settings into one neat object
  const componentProps = {
    email: email || "student@campusklub.com",
    amount: amountInKobo,
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY as string,
    text: `Pay ₦${totalNaira.toLocaleString()} Now`,
    onSuccess: handleSuccess,
    onClose: handleClose,
  };

  // 4. If we are saving, we show a dummy button so they can't click it twice
  if (isSaving) {
    return (
      <button disabled className="w-full bg-green-600 text-white font-bold h-12 text-lg rounded-xl flex items-center justify-center opacity-75 cursor-not-allowed">
        <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Saving Order...
      </button>
    );
  }

  // 5. THE FIX: Render the rock-solid Paystack Component!
  return (
    <PaystackButton 
      {...componentProps} 
      className="w-full bg-green-600 text-white hover:bg-green-700 font-bold h-12 text-lg rounded-xl transition-colors flex items-center justify-center" 
    />
  );
}