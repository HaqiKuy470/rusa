"use server"; // <--- WAJIB DI PALING ATAS (Baris 1)

import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

// --- FUNCTION REGISTER ---
export async function signup(formData: FormData) {
  const supabase = await createClient();
  
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("fullName") as string;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  if (data.user) {
    try {
      await prisma.profile.create({
        data: {
          id: data.user.id,
          email: email,
          fullName: fullName,
          avatarUrl: `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${fullName}`,
          role: "ANAK"
        }
      });
    } catch (dbError) {
      console.error("Gagal buat profile:", dbError);
    }
  }

  revalidatePath('/', 'layout');
  redirect('/login?message=Cek emailmu untuk konfirmasi, lalu login ya!');
}

// --- FUNCTION LOGIN BIASA ---
export async function login(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: "Email atau password salah nih!" };
  }

  revalidatePath('/', 'layout');
  redirect('/forum');
}

// --- FUNCTION LOGIN GOOGLE ---
export async function loginWithGoogle() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });

  if (error) {
    console.error(error);
    return { error: "Gagal membuka Google Login" };
  }

  if (data.url) {
    redirect(data.url);
  }
}

// --- FUNCTION LOGOUT ---
export async function logout() {
  // JANGAN TULIS "use server" DI SINI LAGI
  
  const supabase = await createClient();
  await supabase.auth.signOut();
  
  redirect("/login");
}

// --- FUNCTION AMBIL KATEGORI FORUM ---
export async function getForumCategories() {
  try {
    return await prisma.forumCategory.findMany();
  } catch (error) {
    return [];
  }
}

// --- FUNCTION AMBIL DISKUSI TERBARU ---
export async function getRecentDiscussions() {
  try {
    return await prisma.forumPost.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        author: { select: { fullName: true, avatarUrl: true } },
        category: { select: { name: true, color: true, icon: true } },
        _count: { select: { comments: true } }
      }
    });
  } catch (error) {
    return [];
  }
}

// --- FUNCTION AMBIL KARYA ---
export async function getApprovedArtworks() {
  try {
    const artworks = await prisma.artwork.findMany({
      where: {
        status: 'APPROVED',
      },
      include: {
        author: {
          select: {
            fullName: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return artworks;
  } catch (error) {
    console.error("Error fetching artworks:", error);
    return [];
  }
}