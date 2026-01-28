'use server'

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createCategory(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const icon = formData.get("icon") as string;
  const color = formData.get("color") as string;

  // Auto-generate slug (contoh: "Dunia Sekolah" -> "dunia-sekolah")
  const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

  try {
    await prisma.forumCategory.create({
      data: {
        name,
        slug,
        description,
        icon,
        color
      }
    });

    revalidatePath('/admin/kategori'); // Refresh halaman admin
    revalidatePath('/forum/buat-topik'); // Refresh halaman user
  } catch (error) {
    console.error("Gagal buat kategori:", error);
  }
}

export async function deleteCategory(id: string) {
    try {
        await prisma.forumCategory.delete({ where: { id } });
        revalidatePath('/admin/kategori');
    } catch (error) {
        console.error("Gagal hapus kategori:", error);
    }
}