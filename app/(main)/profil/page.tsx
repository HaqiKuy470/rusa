import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { 
  ShieldAlert, 
  Lightbulb, // Ganti icon ide biar variasi
  Palette, 
  Clock, 
  ChevronRight, 
  MessageCircleHeart // Icon untuk curhat
} from "lucide-react";

export default async function UserDashboard() {
  const supabase = await createClient();

  // 1. Cek User Login
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // 2. Ambil Data User
  const userData = await prisma.profile.findUnique({
    where: { id: user.id },
    include: {
      reports: {
        orderBy: { createdAt: 'desc' },
        take: 3, 
      },
    }
  });

  const recentReports = userData?.reports || [];

  return (
    <div className="min-h-screen bg-[#FDFBF7] pt-28 pb-10 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* SECTION 1: Header Baru (Dengan Avatar & Tombol Edit) */}
        {/* Kita pakai yang ini saja, yang lama dihapus */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
            <div className="flex items-center gap-4 relative z-10 w-full md:w-auto">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-100 rounded-full overflow-hidden border-4 border-white shadow-sm shrink-0">
                    {userData?.avatarUrl ? (
                        <img src={userData.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-blue-400 font-bold text-2xl">
                         {userData?.fullName?.charAt(0) || "U"}
                        </div>
                    )}
                </div>
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-gray-900">Halo, {userData?.fullName}! 👋</h1>
                    <p className="text-gray-500 text-sm md:text-base">
                       {userData?.role === 'ANAK' ? 'Siap berpetualang hari ini?' : 'Selamat bekerja!'}
                    </p>
                </div>
            </div>

            <Link 
                href="/profil/edit" 
                className="relative z-10 px-5 py-2.5 bg-white border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 hover:text-blue-600 transition-colors shadow-sm text-sm flex items-center gap-2"
            >
                ✏️ Edit Profil
            </Link>
            
            {/* Dekorasi Background */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-50 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 opacity-50"></div>
        </div>

        {/* SECTION 2: Menu Utama (Grid 4 Kolom) */}
        {/* Saya ubah jadi grid-cols-4 biar pas 4 menu sejajar di layar besar */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          
          <MenuCard 
            href="/lapor"
            title="Lapor Bullying"
            desc="Ada yang ganggu? Lapor sini rahasia aman."
            icon={<ShieldAlert size={28} />}
            color="red"
          />

          <MenuCard 
            href="/aspirasi"
            title="Suarakan Ide"
            desc="Punya ide seru buat sekolah? Tulis yuk!"
            icon={<Lightbulb size={28} />}
            color="blue"
          />

          <MenuCard 
            href="/karya/upload"
            title="Upload Karya"
            desc="Pamerin gambar atau tulisan kerenmu."
            icon={<Palette size={28} />}
            color="purple"
          />

          {/* --- MENU BARU: KONSULTASI --- */}
          <MenuCard 
            href="/konsultasi"
            title="Teman Curhat"
            desc="Lagi sedih/bingung? Ngobrol privat yuk."
            icon={<MessageCircleHeart size={28} />}
            color="green" // Warna Hijau biar adem
          />
        </div>

        {/* SECTION 3: Riwayat Laporan */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Clock size={20} className="text-gray-400" />
              Riwayat Laporanmu
            </h2>
            <Link href="/riwayat" className="text-sm text-blue-600 hover:underline font-medium">
              Lihat Semua
            </Link>
          </div>

          <div className="p-0">
            {recentReports.length === 0 ? (
              <div className="p-8 text-center bg-gray-50/50">
                <p className="text-gray-400 mb-4 text-sm">Belum ada laporan yang kamu kirim.</p>
                <Link href="/lapor" className="text-blue-600 font-bold text-sm hover:underline">
                  Buat laporan pertamamu &rarr;
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {recentReports.map((item) => (
                  <div key={item.id} className="p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 bg-white border border-gray-200 text-gray-600 text-[10px] font-bold uppercase tracking-wider rounded">
                          {item.category}
                        </span>
                        <span className="text-xs text-gray-400">
                          • {new Date(item.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                        </span>
                      </div>
                      <p className="text-gray-800 font-medium line-clamp-1">{item.content}</p>
                    </div>

                    <div className="flex items-center gap-4">
                      <StatusBadge status={item.status} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

// --- Komponen UI ---

function MenuCard({ href, title, desc, icon, color }: any) {
  const colors: any = {
    red: "bg-red-50 text-red-600 group-hover:bg-red-100",
    blue: "bg-blue-50 text-blue-600 group-hover:bg-blue-100",
    purple: "bg-purple-50 text-purple-600 group-hover:bg-purple-100",
    green: "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100", // Warna baru untuk Curhat
  };

  return (
    <Link 
      href={href}
      className={`group p-6 rounded-2xl border border-gray-100 bg-white transition-all hover:shadow-lg hover:-translate-y-1 hover:border-${color}-200 h-full flex flex-col`}
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${colors[color]}`}>
        {icon}
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">
        {title}
      </h3>
      <p className="text-gray-500 text-sm leading-relaxed">
        {desc}
      </p>
    </Link>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === 'APPROVED') {
    return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">Selesai</span>;
  }
  if (status === 'REJECTED') {
    return <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold">Dibatalkan</span>;
  }
  return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold">Sedang Dicek</span>;
}