import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { createCategory, deleteCategory } from "@/app/actions/admin-forum";
import { Trash2, Hash, Book, Heart, Gamepad, Music, Star } from "lucide-react";

export default async function AdminKategoriPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Cek Admin
  const profile = await prisma.profile.findUnique({ where: { id: user.id } });
  if (profile?.role !== 'ADMIN') redirect("/dashboard");

  // Ambil data kategori
  const categories = await prisma.forumCategory.findMany({
    orderBy: { name: 'asc' }
  });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Manajemen Kategori Forum 📂</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* FORM TAMBAH KATEGORI */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm sticky top-28">
            <h2 className="font-bold text-lg mb-4">Tambah Kategori Baru</h2>
            <form action={createCategory} className="space-y-4">
              
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nama Kategori</label>
                <input name="name" type="text" required placeholder="Misal: Dunia Sekolah" className="w-full px-4 py-2 border rounded-xl" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Deskripsi Singkat</label>
                <textarea name="description" required rows={3} placeholder="Penjelasan singkat..." className="w-full px-4 py-2 border rounded-xl resize-none"></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Ikon (Kode)</label>
                  <select name="icon" className="w-full px-4 py-2 border rounded-xl">
                    <option value="Book">Buku (Book)</option>
                    <option value="Gamepad">Game (Gamepad)</option>
                    <option value="Heart">Hati (Heart)</option>
                    <option value="Music">Musik (Music)</option>
                    <option value="Star">Bintang (Star)</option>
                    <option value="Hash">Tagar (Hash)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Warna Tema</label>
                  <select name="color" className="w-full px-4 py-2 border rounded-xl">
                    <option value="bg-blue-500">Biru</option>
                    <option value="bg-red-500">Merah</option>
                    <option value="bg-green-500">Hijau</option>
                    <option value="bg-purple-500">Ungu</option>
                    <option value="bg-pink-500">Pink</option>
                    <option value="bg-yellow-500">Kuning</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors">
                + Buat Kategori
              </button>
            </form>
          </div>
        </div>

        {/* LIST KATEGORI */}
        <div className="lg:col-span-2">
            <h2 className="font-bold text-lg mb-4">Daftar Kategori ({categories.length})</h2>
            <div className="grid gap-4">
                {categories.map((cat) => (
                    <div key={cat.id} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white ${cat.color}`}>
                                {/* Render Icon Sederhana */}
                                {cat.icon === 'Book' && <Book size={24} />}
                                {cat.icon === 'Gamepad' && <Gamepad size={24} />}
                                {cat.icon === 'Heart' && <Heart size={24} />}
                                {cat.icon === 'Music' && <Music size={24} />}
                                {cat.icon === 'Star' && <Star size={24} />}
                                {cat.icon === 'Hash' && <Hash size={24} />}
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800">{cat.name}</h3>
                                <p className="text-sm text-slate-500">{cat.description}</p>
                            </div>
                        </div>
                        
                        <form action={deleteCategory.bind(null, cat.id)}>
                            <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Hapus Kategori">
                                <Trash2 size={20} />
                            </button>
                        </form>
                    </div>
                ))}

                {categories.length === 0 && (
                    <div className="text-center p-10 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-slate-400">
                        Belum ada kategori. Silakan buat di formulir samping.
                    </div>
                )}
            </div>
        </div>

      </div>
    </div>
  );
}