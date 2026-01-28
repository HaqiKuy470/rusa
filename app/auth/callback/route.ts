import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/forum';

  if (code) {
    const supabase = await createClient();
    
    // 1. Tukar "Code" dari Google menjadi "Session" Supabase
    const { error, data } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error && data?.user) {
      // 2. CEK & BUAT PROFILE PRISMA (Otomatis)
      const userId = data.user.id;
      const userEmail = data.user.email!;
      const userMeta = data.user.user_metadata;
      
      // Cek apakah user sudah punya profile di database kita?
      const existingProfile = await prisma.profile.findUnique({
        where: { id: userId }
      });

      // Jika belum ada (Login Pertama Kali), buatkan Profilenya
      if (!existingProfile) {
        await prisma.profile.create({
          data: {
            id: userId,
            email: userEmail,
            // Ambil nama dari Google, atau pakai nama depan email
            fullName: userMeta.full_name || userMeta.name || userEmail.split('@')[0],
            // Ambil foto profil asli dari Google
            avatarUrl: userMeta.avatar_url || userMeta.picture,
            role: "ANAK"
          }
        });
      }

      // 3. Login Berhasil, lempar ke halaman tujuan (Forum)
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Jika gagal, kembalikan ke login dengan pesan error
  return NextResponse.redirect(`${origin}/login?message=Gagal login dengan Google`);
}