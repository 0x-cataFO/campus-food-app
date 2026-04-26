// src/app/dashboard/actions.ts
"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// 1. Function to Add Food to Menu
export async function addFoodItem(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  
  const uploadedImage = formData.get("imageUrl") as string;
  const finalImageUrl = uploadedImage || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=500&auto=format&fit=crop";

  let vendor = await prisma.vendorProfile.findUnique({
    where: { userId: session.user.id }
  });

  if (!vendor) {
    vendor = await prisma.vendorProfile.create({
      data: {
        userId: session.user.id,
        storeName: `${session.user.name?.split(" ")[0]}'s Kitchen`,
        location: "Main Campus",
        isOpen: true,
      }
    });
    
    await prisma.user.update({
      where: { id: session.user.id },
      data: { role: "VENDOR" }
    });
  }

  await prisma.foodItem.create({
    data: {
      vendorId: vendor.id,
      name,
      description,
      price,
      imageUrl: finalImageUrl,
    }
  });

  revalidatePath("/dashboard");
  revalidatePath("/menu");
}

// 2. Function to Update Order Status (The one that was missing!)
export async function updateOrderStatus(orderId: string, newStatus: "PENDING" | "READY" | "COMPLETED" | "CANCELLED") {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  // Update the order in the database
  await prisma.order.update({
    where: { id: orderId },
    data: { status: newStatus }
  });

  // Refresh the dashboard to show the new status instantly
  revalidatePath("/dashboard");
  revalidatePath("/menu");
}

// src/app/dashboard/actions.ts
// NEW: Toggle "Out of Stock" / "Active"
export async function toggleFoodAvailability(itemId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const vendor = await prisma.vendorProfile.findUnique({
    where: { userId: session.user.id }
  });

  if (!vendor) throw new Error("Not authorized");

  // Fetch the current item to see if it is true or false
  const item = await prisma.foodItem.findUnique({
    where: { id: itemId, vendorId: vendor.id }
  });

  if (item) {
    // Flip the boolean
    await prisma.foodItem.update({
      where: { id: itemId },
      data: { isAvailable: !item.isAvailable }
    });
    revalidatePath("/dashboard");
    revalidatePath("/menu");
  }
}

// UPDATED: Smart Delete (Hard Delete vs. Soft Delete)
export async function deleteFoodItem(itemId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const vendor = await prisma.vendorProfile.findUnique({
    where: { userId: session.user.id }
  });

  if (!vendor) throw new Error("Not authorized");

  try {
    // 1. Try to completely delete the item from the database
    await prisma.foodItem.delete({
      where: { 
        id: itemId,
        vendorId: vendor.id 
      }
    });
  } catch (error: any) {
    // 2. If Prisma throws P2003 (Foreign Key Constraint Failed)
    if (error.code === 'P2003') {
      console.log("Cannot hard-delete item with order history. Soft deleting instead.");
      
      // We safely "soft delete" it by marking it unavailable
      await prisma.foodItem.update({
        where: { id: itemId, vendorId: vendor.id },
        data: { isAvailable: false }
      });
    } else {
      throw error; // If it's a different error, let it crash normally
    }
  }

  revalidatePath("/dashboard");
  revalidatePath("/menu");
}

// Add this at the bottom of src/app/dashboard/actions.ts

export async function updateFoodItem(itemId: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const vendor = await prisma.vendorProfile.findUnique({
    where: { userId: session.user.id }
  });

  if (!vendor) throw new Error("Not authorized");

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const uploadedImage = formData.get("imageUrl") as string;

  // Build the update data object
  const updateData: any = { name, description, price };
  
  // Only update the image if a new one was uploaded
  if (uploadedImage) {
    updateData.imageUrl = uploadedImage;
  }

  // Save to database
  await prisma.foodItem.update({
    where: { id: itemId, vendorId: vendor.id },
    data: updateData
  });

  revalidatePath("/dashboard");
  revalidatePath("/menu");
}

// Add this at the bottom of src/app/dashboard/actions.ts

export async function toggleStoreStatus() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  // 1. Find the vendor
  const vendor = await prisma.vendorProfile.findUnique({
    where: { userId: session.user.id }
  });

  if (!vendor) throw new Error("Not authorized");

  // 2. Flip the isOpen boolean in the database
  await prisma.vendorProfile.update({
    where: { id: vendor.id },
    data: { isOpen: !vendor.isOpen }
  });

  // 3. Refresh the page
  revalidatePath("/dashboard");
  revalidatePath("/menu");
}