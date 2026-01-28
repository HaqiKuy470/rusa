import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Image from "next/image";
import { updateAdminProfile } from "@/app/actions/admin-settings";
import { 
  User, 
  Mail, 
  Shield, 
  Save, 
  Laptop, 
  Server, 
  GitBranch 
} from "lucide-react";

export default async function AdminSettingsPage() {
  const supabase = await createClient();

  // 1. Cek Login
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // 2. Ambil Data Profile Admin
  const profile = await prisma.profile.findUnique({ where: { id: user.id } });
  if (profile?.role !== 'ADMIN') redirect("/dashboard");

  return (
    <div className="max-w-4xl mx-auto space-y-8 font-nunito">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Pengaturan ⚙️</h1>
        <p className="text-gray-500 mt-1">Kelola profil admin dan konfigurasi sistem.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* KOLOM KIRI: KARTU PROFIL */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm text-center">
            <div className="relative w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-4 border-blue-50">
              <Image 
                src={profile.avatarUrl || `https://api.dicebear.com/9.x/fun-emoji/svg?seed=${profile.fullName}`}
                alt="Avatar"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <h2 className="font-bold text-gray-900 text-lg">{profile.fullName}</h2>
            <div className="flex items-center justify-center gap-2 mt-1 text-xs font-bold text-blue-600 bg-blue-50 py-1 px-3 rounded-full w-fit mx-auto">
              <Shield size={12} /> ADMINISTRATOR
            </div>
          </div>

          <div className="bg-blue-600 p-6 rounded-2xl shadow-lg text-white">
            <h3 className="font-bold mb-2 flex items-center gap-2">
              <Server size={18} /> Status Sistem
            </h3>
            <div className="space-y-3 text-sm text-blue-100">
              <div className="flex justify-between border-b border-blue-500 pb-2">
                <span>Versi Aplikasi</span>
                <span className="font-mono font-bold text-white">v1.0.0</span>
              </div>
              <div className="flex justify-between border-b border-blue-500 pb-2">
                <span>Database</span>
                <span className="font-bold text-green-300">Connected ●</span>
              </div>
              <div className="flex justify-between">
                <span>Mode</span>
                <span className="font-bold text-white">Production</span>
              </div>
            </div>
          </div>
        </div>

        {/* KOLOM KANAN: FORM EDIT */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Form Edit Profil */}
          <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
            <h3 className="font-bold text-gray-800 text-lg mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
              <User size={20} className="text-blue-600" />
              Edit Informasi Akun
            </h3>
            
            <form action={updateAdminProfile} className="space-y-5">
              <input type="hidden" name="userId" value={user.id} />
              
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-2">Nama Lengkap</label>
                <input 
                  type="text" 
                  name="fullName"
                  defaultValue={profile.fullName}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 bg-gray-50 transition-all font-bold text-gray-700"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-600 mb-2">Email (Tidak bisa diubah)</label>
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed">
                  <Mail size={18} />
                  <span className="font-mono text-sm">{profile.email}</span>
                </div>
              </div>

              <div className="pt-4">
                <button type="submit" className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-95">
                  <Save size={18} />
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>

          {/* Konfigurasi Aplikasi (Placeholder) */}
          <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm opacity-75">
            <h3 className="font-bold text-gray-800 text-lg mb-4 flex items-center gap-2">
              <Laptop size={20} className="text-gray-400" />
              Konfigurasi Lanjutan
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Pengaturan sistem global seperti Mode Maintenance dan Filter Kata Kasar dapat diakses melalui database environtment untuk saat ini.
            </p>
            <button disabled className="px-4 py-2 bg-gray-100 text-gray-400 font-bold rounded-lg text-sm cursor-not-allowed border border-gray-200">
              🔒 Kunci Sistem
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}