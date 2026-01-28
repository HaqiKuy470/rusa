'use server'

import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function uploadArtwork(formData: FormData) {
  const supabase = await createClient();
  
  // 1. Cek User Login
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // 2. Ambil Data dari Form
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const file = formData.get("file") as File;
  
  // Ambil value checkbox (jika dicentang nilainya "on", jika tidak null)
  const isAnonim = formData.get("isAnonim") === "on";

  if (!title || !file) {
    return { error: "Judul dan Gambar wajib diisi ya!" };
  }

  // 3. Validasi File (Harus Gambar & Max 2MB)
  if (!file.type.startsWith("image/")) {
    return { error: "File harus berupa gambar (JPG/PNG)." };
  }
  if (file.size > 2 * 1024 * 1024) { // 2MB limit
    return { error: "Ukuran gambar maksimal 2MB ya." };
  }

  try {
    // 4. Upload ke Supabase Storage
    // Nama file unik: userID-timestamp-namafile
    const fileName = `${user.id}-${Date.now()}-${file.name.replace(/\s/g, '-')}`;
    
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('artworks') // Pastikan nama bucket di Supabase adalah 'artworks'
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) throw uploadError;

    // 5. Dapatkan Public URL
    const { data: { publicUrl } } = supabase
      .storage
      .from('artworks')
      .getPublicUrl(fileName);

    // 6. Simpan ke Database Prisma
    await prisma.artwork.create({
      data: {
        title,
        description,
        imageUrl: publicUrl,
        authorId: user.id,
        status: 'PENDING', // Wajib dimoderasi dulu
        isAnonim: isAnonim // Simpan status anonim
      }
    });

    // Refresh halaman terkait
    revalidatePath('/galeri');
    revalidatePath('/profil');
    
  } catch (error) {
    console.error("Gagal upload:", error);
    return { error: "Maaf, ada gangguan sistem. Coba lagi nanti ya!" };
  }

  // 7. Redirect Sukses
  redirect("/profil?success=true");
}