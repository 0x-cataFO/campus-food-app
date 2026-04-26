"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { CartItem } from "@/store/useCartStore"; 
import { revalidatePath } from "next/cache";

export async function processSuccessfulPayment(cartItems: CartItem[], paymentReference: string) {
  console.log("🟡 SERVER ACTION STARTED. Reference:", paymentReference);
  
  const session = await auth();
  console.log("🟡 USER SESSION:", session?.user?.id ? "Logged In" : "NOT LOGGED IN");
  
  if (!session?.user?.id) throw new Error("Unauthorized: User not logged in");

  try {
    const itemsByVendor = cartItems.reduce((acc, item) => {
      if (!acc[item.vendorId]) acc[item.vendorId] = [];
      acc[item.vendorId].push(item);
      return acc;
    }, {} as Record<string, CartItem[]>);

    for (const vendorId in itemsByVendor) {
      const items = itemsByVendor[vendorId];
      const vendorTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      console.log(`🟡 SAVING ORDER FOR VENDOR ${vendorId}...`);
      
      // Try to create the order
      await prisma.order.create({
        data: {
          studentId: session.user.id,
          vendorId: vendorId,
          totalAmount: vendorTotal,
          status: "PENDING", 
          paymentMethod: "PAYSTACK", 
          isPaid: true,              
          items: {
            create: items.map((item) => ({
              foodItemId: item.id,
              quantity: item.quantity,
              priceAtBuy: item.price
            }))
          }
        }
      });
      console.log("🟢 ORDER SAVED SUCCESSFULLY!");
    }

    revalidatePath("/profile");
    revalidatePath("/dashboard");
    
    return { success: true };
  } catch (error) {
    // THIS is where the real error will print!
    console.error("🔴 DATABASE CRASH DETAILS:", error);
    throw new Error("Failed to save order after payment.");
  }
}