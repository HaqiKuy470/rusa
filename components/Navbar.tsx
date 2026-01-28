import Link from "next/link";
import Image from "next/image";
import { Home, Image as ImageIcon, MessageCircle } from "lucide-react";
import { createClient } from "@/utils/supabase/server"; // Pakai Server Client
import { prisma } from "@/lib/prisma";
import UserMenu from "./UserMenu"; // Import dari file terpisah tadi

export default async function Navbar() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let userProfile = null;

  if (user) {
    userProfile = await prisma.profile.findUnique({
      where: { id: user.id },
      select: { fullName: true, avatarUrl: true, role: true }
    });
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm font-nunito">
      <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 transform group-hover:rotate-12 transition-transform duration-300">
             <Image src="/logo.svg" alt="RUSA" fill className="object-contain" />
          </div>
        </Link>

        {/* MENU TENGAH */}
        <div className="hidden md:flex items-center gap-1 bg-slate-50 p-1 rounded-full border border-slate-100">
          <Link href="/" className="flex items-center gap-2 px-5 py-2 rounded-full text-slate-600 font-bold text-sm hover:bg-white hover:text-blue-600 hover:shadow-sm transition-all">
            <Home size={18} /> Beranda
          </Link>
          <Link href="/galeri" className="flex items-center gap-2 px-5 py-2 rounded-full text-slate-600 font-bold text-sm hover:bg-white hover:text-blue-600 hover:shadow-sm transition-all">
            <ImageIcon size={18} /> Galeri
          </Link>
          <Link href="/forum" className="flex items-center gap-2 px-5 py-2 rounded-full text-slate-600 font-bold text-sm hover:bg-white hover:text-blue-600 hover:shadow-sm transition-all">
            <MessageCircle size={18} /> Forum
          </Link>
        </div>

        {/* MENU KANAN (UserMenu) */}
        <div className="flex items-center gap-3">
          {user && userProfile ? (
            <UserMenu 
              user={{
                name: userProfile.fullName,
                imageUrl: userProfile.avatarUrl || "https://api.dicebear.com/9.x/fun-emoji/svg?seed=User",
                role: userProfile.role
              }} 
            />
          ) : (
            <Link 
              href="/login"
              className="px-6 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-extrabold rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 active:scale-95"
            >
              Masuk
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}