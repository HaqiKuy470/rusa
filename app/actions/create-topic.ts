'use server'

import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createTopic(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const categoryId = formData.get("categoryId") as string;
  const isAnonim = formData.get("isAnonim") === "on";

  if (!title || !content || !categoryId) {
    return { error: "Judul, Konten, dan Kategori wajib diisi ya!" };
  }

  try {
    await prisma.forumPost.create({
      data: {
        title,
        content,
        categoryId,
        authorId: user.id,
        isAnonim: isAnonim
      }
    });

    revalidatePath('/forum');
  } catch (error) {
    console.error("Gagal buat topik:", error);
    return { error: "Gagal memposting topik. Coba lagi." };
  }

  redirect("/forum");
}