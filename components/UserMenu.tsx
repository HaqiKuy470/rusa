"use client"; // Wajib ada di baris pertama

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client"; // Pastikan file client.ts sudah dibuat
import { LogOut, LayoutDashboard, User, ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type UserProps = {
  imageUrl: string;
  name: string;
  role: string;
};

export default function UserMenu({ user }: { user: UserProps }) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  // Safety check: Jika data user kosong, jangan render apa-apa agar tidak error
  if (!user) return null;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
    router.push("/login");
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 pr-3 rounded-full hover:bg-slate-50 transition-all border border-transparent hover:border-slate-200"
      >
        <div className="relative w-10 h-10 rounded-full overflow-hidden border border-slate-200 shadow-sm bg-white">
          <Image
            src={user.imageUrl}
            alt={user.name}
            fill
            className="object-cover"
            unoptimized // PENTING: Agar gambar DiceBear muncul
          />
        </div>
        
        <div className="hidden md:block text-left">
            <p className="text-xs font-bold text-slate-700 leading-tight max-w-[100px] truncate">
                {user.name}
            </p>
            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                {user.role}
            </p>
        </div>
        <ChevronDown size={14} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
          <div className="absolute right-0 top-14 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50">
             {/* Menu Dashboard Admin (Hanya muncul jika user ADMIN) */}
             {user.role === 'ADMIN' && (
                <Link href="/admin" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-slate-600 hover:text-blue-600 hover:bg-blue-50">
                  <LayoutDashboard size={18} /> Admin Panel
                </Link>
             )}
             <Link href="/profil" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-slate-600 hover:text-blue-600 hover:bg-blue-50">
                <User size={18} /> Profil Saya
             </Link>
             
             <div className="h-px bg-slate-100 my-1 mx-2"></div>
             
             <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 text-left">
                <LogOut size={18} /> Keluar
             </button>
          </div>
        </>
      )}
    </div>
  );
}