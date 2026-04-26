"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const phone = formData.get("phone") as string;
  const name = formData.get("name") as string; // NEW: Grab the name

  await prisma.user.update({
    where: { id: session.user.id },
    data: { phone, name } // NEW: Save both to DB
  });

  revalidatePath("/profile");
}