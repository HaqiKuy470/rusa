import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";
import { 
  AlertTriangle, 
  MessageSquare, 
  Palette, 
  ArrowRight,
  Clock,
  LockIcon
} from 'lucide-react';
import Link from 'next/link';
import { redirect } from "next/navigation";

export default async function AdminDashboard() {
  const supabase = await createClient();

  // 1. Cek User Login
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // 2. Cek Role Admin via Prisma
  const profile = await prisma.profile.findUnique({
    where: { id: user.id }
  });

  if (profile?.role !== 'ADMIN') {
    redirect("/dashboard"); // Tendang jika bukan admin
  }

  // 3. Fetch Data Real-time Menggunakan Prisma
  const [
    laporanCount, 
    konsultasiCount, // Ganti Aspirasi jadi Konsultasi (Sesuai Schema)
    karyaPendingCount,
    recentLaporan
  ] = await Promise.all([
    // Hitung Laporan PENDING
    prisma.report.count({ where: { status: 'PENDING' } }),
    
    // Hitung Konsultasi OPEN
    prisma.consultation.count({ where: { status: 'OPEN' } }),

    // Hitung Karya PENDING
    prisma.artwork.count({ where: { status: 'PENDING' } }),

    // Ambil 5 Laporan Terbaru
    prisma.report.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        reporter: true // Include relasi ke profile pelapor
      }
    })
  ]);

  return (
    <div className="space-y-8 font-nunito">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Dashboard Admin</h1>
          <p className="text-gray-500 mt-1">Pantau aktivitas, moderasi konten, dan jaga keamanan anak.</p>
        </div>
        <div className="text-sm font-bold text-gray-500 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
            📅 {new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Laporan */}
        <StatCard 
          title="Laporan Masuk" 
          value={laporanCount} 
          icon={<AlertTriangle className="text-red-600" size={24} />}
          bg="bg-red-50"
          desc="Laporan bullying & konten negatif"
          href="/admin/laporan"
        />

        {/* Card 2: Karya */}
        <StatCard 
          title="Verifikasi Karya" 
          value={karyaPendingCount} 
          icon={<Palette className="text-purple-600" size={24} />}
          bg="bg-purple-50"
          desc="Karya anak menunggu approval"
          href="/admin/karya" // Pastikan route ini nanti dibuat
        />

        {/* Card 3: Konsultasi (Pengganti Aspirasi) */}
        <StatCard 
          title="Sesi Konsultasi" 
          value={konsultasiCount} 
          icon={<MessageSquare className="text-blue-600" size={24} />}
          bg="bg-blue-50"
          desc="Chat konsultasi yang sedang aktif"
          href="/admin/konsultasi"
        />
      </div>

      {/* Tabel Prioritas: Laporan Terbaru */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <Clock size={18} className="text-gray-400" />
            Laporan Terbaru Perlu Tinjauan
          </h3>
          <Link href="/admin/laporan" className="text-sm text-blue-600 font-bold hover:underline flex items-center">
            Lihat Semua <ArrowRight size={14} className="ml-1"/>
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-xs border-b border-gray-100 tracking-wider">
              <tr>
                <th className="px-6 py-4">Pelapor</th>
                <th className="px-6 py-4">Kategori Masalah</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Tanggal</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentLaporan.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-2xl">🛡️</span>
                        <p>Aman! Belum ada laporan baru.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                recentLaporan.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4 font-bold text-gray-900 flex items-center gap-2">
                      {item.isAnonim ? (
                        <>
                            <LockIcon size={16} className="text-purple-500" />
                            <span className="text-purple-700">Anonim</span>
                            <span className="text-[10px] text-gray-400 font-normal">({item.reporter.fullName})</span>
                        </>
                      ) : (
                        item.reporter.fullName
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-bold border border-red-100">
                        {item.category || 'Bullying'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="px-6 py-4 text-gray-500 font-medium">
                      {new Date(item.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link 
                        href={`/admin/laporan/${item.id}`} // Pastikan page detail ini dibuat
                        className="text-blue-600 hover:text-blue-800 font-bold text-xs bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition-colors"
                      >
                        Tinjau
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

// --- Komponen UI Kecil ---

function StatCard({ title, value, icon, bg, desc, href }: any) {
  return (
    <Link href={href || "#"} className="block group">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-all h-full relative overflow-hidden">
        <div className="flex justify-between items-start mb-4">
            <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{title}</p>
            <h3 className="text-4xl font-extrabold text-gray-900 mt-2">{value}</h3>
            </div>
            <div className={`p-3 rounded-xl ${bg} group-hover:scale-110 transition-transform`}>
            {icon}
            </div>
        </div>
        <p className="text-xs text-gray-500 font-medium">{desc}</p>
        </div>
    </Link>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: any = {
    PENDING: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    APPROVED: 'bg-green-100 text-green-700 border-green-200',
    REJECTED: 'bg-gray-100 text-gray-600 border-gray-200',
  };
  
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${styles[status] || styles.PENDING}`}>
      {status === 'PENDING' ? 'PERLU TINJAUAN' : status}
    </span>
  );
}