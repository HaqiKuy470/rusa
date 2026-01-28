'use server'

import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return;

  const fullName = formData.get("fullName") as string;
  const avatarUrl = formData.get("avatarUrl") as string;

  try {
    await prisma.profile.update({
      where: { id: user.id },
      data: {
        fullName,
        avatarUrl,
      },
    });

    revalidatePath('/profil'); // Refresh halaman profil agar data baru muncul
    revalidatePath('/dashboard'); 
  } catch (error) {
    console.error("Gagal update profil:", error);
    return { error: "Gagal menyimpan perubahan." };
  }

  redirect("/profil"); // Kembali ke halaman profil setelah selesai
}