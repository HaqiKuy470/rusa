import { prisma } from "@/lib/prisma"; // Import dari file yang baru dibuat/dicek tadi
import { AlertTriangle, CheckCircle, Clock, Search, Filter } from 'lucide-react';
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

// Kita gunakan 'force-dynamic' agar data selalu fresh saat dibuka
export const dynamic = 'force-dynamic';

export default async function LaporanPage() {
  // 1. Cek User Login pakai Supabase Auth (tetap dipakai untuk cek sesi)
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect("/login");
  }

  // 2. Fetch Data Laporan pakai PRISMA (Lebih Aman & Rapi)
  const laporanList = await prisma.report.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      reporter: {
        select: {
          fullName: true, // Ambil nama pelapor
          email: true,
        },
      },
    },
  });

  return (
    <div className="space-y-6">
      {/* Header Halaman */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Laporan Masuk</h1>
          <p className="text-gray-500">Moderasi laporan bullying dan konten negatif.</p>
        </div>
        
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm">
            <Clock size={16} />
            {laporanList.length} Laporan Total
          </button>
        </div>
      </div>

      {/* Tabel Laporan */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Toolbar Pencarian */}
        <div className="p-4 border-b border-gray-100 flex gap-4 bg-gray-50/50">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Cari pelapor..." 
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Pelapor</th>
                <th className="px-6 py-4">Kategori</th>
                <th className="px-6 py-4">Isi Laporan</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Tanggal</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {laporanList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <CheckCircle size={48} className="text-green-100 text-5xl mb-3" />
                      <p className="text-gray-900 font-medium">Semua Bersih!</p>
                      <p className="text-sm">Tidak ada laporan masuk.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                laporanList.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        {item.isAnonim ? (
                          <span className="flex items-center gap-1 text-gray-500 italic">
                            🚫 Anonim
                          </span>
                        ) : (
                          item.reporter?.fullName || "User Terhapus"
                        )}
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">
                         {item.isAnonim ? "Identitas Dirahasiakan" : item.reporter?.email}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-red-50 text-red-700 rounded text-xs font-semibold border border-red-100">
                        {item.category}
                      </span>
                    </td>

                    <td className="px-6 py-4 max-w-xs truncate" title={item.content}>
                      {item.content}
                    </td>

                    <td className="px-6 py-4">
                       <StatusBadge status={item.status} />
                    </td>

                    <td className="px-6 py-4 text-gray-500">
                      {new Date(item.createdAt).toLocaleDateString('id-ID')}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <button className="text-blue-600 hover:underline font-medium text-sm">
                        Tinjau
                      </button>
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

// Komponen Kecil Badge Status
function StatusBadge({ status }: { status: string }) {
  if (status === 'APPROVED') {
    return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">Selesai</span>;
  }
  if (status === 'REJECTED') {
    return <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold">Ditolak</span>;
  }
  return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold">Pending</span>;
}