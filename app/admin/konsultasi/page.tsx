import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { 
  MessageCircle, 
  Search, 
  User, 
  Clock, 
  CheckCircle2, 
  MoreHorizontal 
} from "lucide-react";

export default async function AdminKonsultasiPage() {
  const supabase = await createClient();

  // 1. Cek Login & Role Admin
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const profile = await prisma.profile.findUnique({ where: { id: user.id } });
  if (profile?.role !== 'ADMIN') redirect("/dashboard");

  // 2. Ambil SEMUA Data Konsultasi (Diurutkan dari yang terbaru update)
  const consultations = await prisma.consultation.findMany({
    orderBy: { updatedAt: 'desc' },
    include: {
      student: true,    // Data Siswa
      counselor: true,  // Data Pengurus/Konselor yang menangani
      messages: {       // Ambil 1 pesan terakhir untuk preview
        take: 1,
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  return (
    <div className="space-y-8 font-nunito">
      
      {/* HEADER */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Pantau Konsultasi 💬</h1>
          <p className="text-gray-500 mt-1">Monitoring seluruh sesi curhat siswa & pengurus.</p>
        </div>
        
        {/* Statistik Ringkas */}
        <div className="flex gap-3">
            <div className="bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm text-center">
                <span className="block text-xs font-bold text-gray-400 uppercase">Aktif</span>
                <span className="text-xl font-bold text-blue-600">
                    {consultations.filter(c => c.status === 'OPEN').length}
                </span>
            </div>
            <div className="bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm text-center">
                <span className="block text-xs font-bold text-gray-400 uppercase">Selesai</span>
                <span className="text-xl font-bold text-gray-600">
                    {consultations.filter(c => c.status === 'CLOSED').length}
                </span>
            </div>
        </div>
      </div>

      {/* TABEL DATA */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Search Bar (Visual Only) */}
        <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex gap-4">
            <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Cari nama siswa atau topik..." 
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
            </div>
        </div>

        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-xs border-b border-gray-100 tracking-wider">
                    <tr>
                        <th className="px-6 py-4">Siswa</th>
                        <th className="px-6 py-4">Topik Masalah</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Ditangani Oleh</th>
                        <th className="px-6 py-4">Update Terakhir</th>
                        <th className="px-6 py-4 text-right">Aksi</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {consultations.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                                Belum ada sesi konsultasi dimulai.
                            </td>
                        </tr>
                    ) : (
                        consultations.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50 transition-colors group">
                                
                                {/* KOLOM 1: SISWA */}
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                                            {item.student?.fullName?.charAt(0) || "U"}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">{item.student?.fullName || "Anonim"}</p>
                                            <p className="text-xs text-gray-400">Siswa</p>
                                        </div>
                                    </div>
                                </td>

                                {/* KOLOM 2: TOPIK */}
                                <td className="px-6 py-4">
                                    <p className="font-medium text-gray-800 line-clamp-1">{item.topic}</p>
                                    <p className="text-xs text-gray-400 line-clamp-1 mt-0.5 italic">
                                        "{item.messages[0]?.content || 'Belum ada pesan...'}"
                                    </p>
                                </td>

                                {/* KOLOM 3: STATUS */}
                                <td className="px-6 py-4">
                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                                        item.status === 'OPEN' 
                                        ? 'bg-green-50 text-green-700 border-green-200' 
                                        : 'bg-gray-100 text-gray-500 border-gray-200'
                                    }`}>
                                        {item.status === 'OPEN' ? '🟢 AKTIF' : '⚪ SELESAI'}
                                    </span>
                                </td>

                                {/* KOLOM 4: KONSELOR */}
                                <td className="px-6 py-4">
                                    {item.counselor ? (
                                        <div className="flex items-center gap-2">
                                            <User size={14} className="text-purple-500" />
                                            <span className="font-medium text-gray-700">{item.counselor.fullName}</span>
                                        </div>
                                    ) : (
                                        <span className="text-xs text-gray-400 italic">Belum ada</span>
                                    )}
                                </td>

                                {/* KOLOM 5: TANGGAL */}
                                <td className="px-6 py-4 text-gray-500 text-xs">
                                    <div className="flex items-center gap-1">
                                        <Clock size={12} />
                                        {new Date(item.updatedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute:'2-digit' })}
                                    </div>
                                </td>

                                {/* KOLOM 6: AKSI */}
                                <td className="px-6 py-4 text-right">
                                    <Link 
                                        href={`/konsultasi/${item.id}`} // Link ke Chat Room Universal
                                        className="inline-flex items-center justify-center px-3 py-1.5 bg-white border border-gray-200 hover:border-blue-500 hover:text-blue-600 rounded-lg text-xs font-bold transition-all shadow-sm"
                                    >
                                        <MessageCircle size={14} className="mr-1" />
                                        Lihat Chat
                                    </Link>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}