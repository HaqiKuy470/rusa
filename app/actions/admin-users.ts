'use server'

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateUserRole(formData: FormData) {
  const userId = formData.get("userId") as string;
  const newRole = formData.get("newRole") as "ADMIN" | "PENGURUS" | "ANAK";

  try {
    await prisma.profile.update({
      where: { id: userId },
      data: { role: newRole }
    });
    
    revalidatePath('/admin/users'); // Refresh halaman agar data berubah
  } catch (error) {
    console.error("Gagal update role:", error);
  }
}