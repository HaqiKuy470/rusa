'use server'

import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function submitReport(formData: FormData) {
  const supabase = await createClient();

  // 1. Cek User (Wajib Login untuk melapor, meski nanti anonim di data)
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { error: "Kamu harus login dulu untuk melapor ya." };
  }

  // 2. Ambil Data dari Form
  const category = formData.get("category") as string;
  const content = formData.get("content") as string;
  const isAnonim = formData.get("isAnonim") === "on"; // Checkbox mengembalikan 'on' jika dicentang

  // Validasi sederhana
  if (!category || !content) {
    return { error: "Mohon isi semua kolom yang wajib ya." };
  }

  try {
    // 3. Simpan ke Database via Prisma
    await prisma.report.create({
      data: {
        category,
        content,
        isAnonim,
        reporterId: user.id, // ID pelapor tetap disimpan sistem, tapi disembunyikan jika isAnonim true
        status: 'PENDING'
      }
    });

    // 4. Refresh Halaman Admin & Redirect ke Halaman Sukses
    revalidatePath('/admin/laporan');
  } catch (err) {
    console.error("Gagal lapor:", err);
    return { error: "Maaf, ada kesalahan sistem. Coba lagi nanti ya." };
  }

  // Redirect dilakukan di luar try-catch block di Next.js
  redirect("/lapor/sukses");
}