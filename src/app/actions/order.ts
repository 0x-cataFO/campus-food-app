"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { CartItem } from "@/store/useCartStore";

export async function processCheckout(cartItems: CartItem[]) {
  // 1. Ensure the user is actually logged in!
  // (Remember: Anyone who logs in via Google defaults to the 'STUDENT' role in our schema)
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Please log in to place an order." };
  }

  try {
    // 2. Group the cart items by Vendor
    // If they bought from 2 different stores, we need to create 2 separate orders.
    const itemsByVendor = cartItems.reduce((acc, item) => {
      if (!acc[item.vendorId]) acc[item.vendorId] = [];
      acc[item.vendorId].push(item);
      return acc;
    }, {} as Record<string, CartItem[]>);

    // 3. Loop through each vendor's group and create an Order in the database
    for (const vendorId in itemsByVendor) {
      const items = itemsByVendor[vendorId];
      
      // Never trust the client's total price for security. Always recalculate on the server!
      const orderTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      await prisma.order.create({
        data: {
          studentId: session.user.id,
          vendorId: vendorId,
          totalAmount: orderTotal,
          paymentMethod: "PAY_ON_PICKUP", // MVP: Students pay when they get the food
          
          // Prisma lets us create the Order and the OrderItems all at the exact same time
          items: {
            create: items.map((item) => ({
              foodItemId: item.id,
              quantity: item.quantity,
              priceAtBuy: item.price, // Lock in the price in case the vendor changes it later!
            }))
          }
        }
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Checkout failed:", error);
    return { success: false, error: "Something went wrong processing your order." };
  }
}