'use server'

import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function submitReport(formData: FormData) {
  const supabase = await createClient();
  
  // 1. Cek User
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // 2. Ambil Data
  const category = formData.get("category") as string;
  const content = formData.get("content") as string;
  const isAnonim = formData.get("isAnonim") === "on";

  // Validasi sederhana
  if (!content) {
    // Jangan return object error di sini jika dipakai langsung di <form>
    return; 
  }

  try {
    // 3. Simpan ke Database
    await prisma.report.create({
      data: {
        category: category || "Lainnya",
        content,
        isAnonim,
        reporterId: user.id,
        status: 'PENDING'
      }
    });

    // Refresh halaman admin agar laporan masuk terlihat
    revalidatePath('/admin/laporan');
    revalidatePath('/pengurus/laporan');
    
  } catch (error) {
    console.error("Gagal kirim laporan:", error);
    // ⚠️ HAPUS return { error: ... } DI SINI
    // Biarkan kosong atau throw error jika ingin crash page (tidak disarankan)
  }

  // 4. Redirect Sukses
  redirect("/dashboard?success=lapor");
}
