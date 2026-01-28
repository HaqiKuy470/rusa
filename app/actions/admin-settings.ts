'use server'

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateAdminProfile(formData: FormData) {
  const userId = formData.get("userId") as string;
  const fullName = formData.get("fullName") as string;
  
  // (Opsional: Logic upload avatar bisa ditambahkan di sini jika diperlukan, 
  // untuk saat ini kita fokus update nama dulu agar simpel)

  try {
    await prisma.profile.update({
      where: { id: userId },
      data: { fullName }
    });

    revalidatePath('/admin/settings');
    revalidatePath('/admin'); // Refresh dashboard juga biar nama di header berubah
  } catch (error) {
    console.error("Gagal update profil:", error);
    return { error: "Gagal menyimpan perubahan." };
  }
}