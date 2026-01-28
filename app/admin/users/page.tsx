import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Image from "next/image";
import { updateUserRole } from "@/app/actions/admin-users";
import { Search, Shield, UserCog, User, Save } from "lucide-react";

export default async function AdminUsersPage() {
  const supabase = await createClient();

  // 1. Cek Login & Role Admin
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const profile = await prisma.profile.findUnique({ where: { id: user.id } });
  if (profile?.role !== 'ADMIN') redirect("/dashboard");

  // 2. Ambil Semua Data User (Urutkan dari yang terbaru daftar)
  const users = await prisma.profile.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-8 font-nunito">
      
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Manajemen Pengguna 👥</h1>
          <p className="text-gray-500 mt-1">Atur hak akses dan peran pengguna dalam sistem.</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm">
           <span className="text-xs font-bold text-gray-400 uppercase block">Total User</span>
           <span className="text-xl font-bold text-blue-600">{users.length}</span>
        </div>
      </div>

      {/* Tabel User */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        
        {/* Search Bar (Visual) */}
        <div className="p-4 border-b border-gray-100 bg-gray-50/50">
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Cari nama atau email..." 
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
            </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-xs border-b border-gray-100 tracking-wider">
              <tr>
                <th className="px-6 py-4">User Profile</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role Saat Ini</th>
                <th className="px-6 py-4">Ubah Role</th>
                <th className="px-6 py-4">Tanggal Gabung</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50 transition-colors group">
                  
                  {/* KOLOM 1: PROFILE */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-100 border border-gray-200">
                            <Image 
                                src={u.avatarUrl || `https://api.dicebear.com/9.x/fun-emoji/svg?seed=${u.fullName}`}
                                alt={u.fullName}
                                fill
                                className="object-cover"
                                unoptimized
                            />
                        </div>
                        <div>
                            <p className="font-bold text-gray-900">{u.fullName}</p>
                            <p className="text-xs text-gray-400">ID: {u.id.slice(0, 8)}...</p>
                        </div>
                    </div>
                  </td>

                  {/* KOLOM 2: EMAIL */}
                  <td className="px-6 py-4 font-mono text-gray-600">
                    {u.email}
                  </td>

                  {/* KOLOM 3: ROLE LABEL */}
                  <td className="px-6 py-4">
                    <RoleBadge role={u.role} />
                  </td>

                  {/* KOLOM 4: FORM UBAH ROLE */}
                  <td className="px-6 py-4">
                    <form action={updateUserRole} className="flex items-center gap-2">
                        <input type="hidden" name="userId" value={u.id} />
                        <div className="relative">
                            <select 
                                name="newRole" 
                                defaultValue={u.role}
                                className="appearance-none pl-3 pr-8 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-bold text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 cursor-pointer"
                            >
                                <option value="ANAK">ANAK</option>
                                <option value="PENGURUS">PENGURUS</option>
                                <option value="ADMIN">ADMIN</option>
                            </select>
                            {/* Icon panah kecil custom */}
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                            </div>
                        </div>
                        <button 
                            type="submit"
                            title="Simpan Perubahan" 
                            className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-colors"
                        >
                            <Save size={16} />
                        </button>
                    </form>
                  </td>

                  {/* KOLOM 5: TANGGAL */}
                  <td className="px-6 py-4 text-gray-400 text-xs">
                    {new Date(u.createdAt).toLocaleDateString('id-ID', { dateStyle: 'medium' })}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// --- Komponen Badge Role ---
function RoleBadge({ role }: { role: string }) {
    if (role === 'ADMIN') {
        return (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-700 border border-purple-200">
                <Shield size={12} /> ADMIN
            </span>
        )
    }
    if (role === 'PENGURUS') {
        return (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200">
                <UserCog size={12} /> PENGURUS
            </span>
        )
    }
    return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-600 border border-gray-200">
            <User size={12} /> ANAK
        </span>
    )
}