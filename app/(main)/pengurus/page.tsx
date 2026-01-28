import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
    ClipboardList,
    MessageCircle,
    Palette,
    ShieldAlert,
    CheckCircle2,
    Clock,
    ArrowRight
} from "lucide-react";

export default async function PengurusDashboard() {
    const supabase = await createClient();

    // 1. Cek User & Role
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    const userProfile = await prisma.profile.findUnique({
        where: { id: user.id },
    });

    // PROTEKSI: Jika bukan Pengurus/Admin, tendang ke home
    if (userProfile?.role === 'ANAK') {
        redirect("/dashboard");
    }

    // 2. Ambil Statistik Kerja (Task Counter)
    // Menghitung berapa "PR" yang harus dikerjakan pengurus
    const pendingReports = await prisma.report.count({
        where: { status: 'PENDING' }
    });

    const pendingArtworks = await prisma.artwork.count({
        where: { status: 'PENDING' }
    });

    // Konsultasi yang belum ditutup (OPEN) dan butuh balasan
    const activeConsultations = await prisma.consultation.count({
        where: { status: 'OPEN' }
    });

    // 3. Ambil Data Terbaru (List Ringkas)
    const recentConsultations = await prisma.consultation.findMany({
        where: { status: 'OPEN' },
        take: 3,
        orderBy: { updatedAt: 'desc' },
        include: {
            student: true, // Ambil nama siswa
            messages: {
                take: 1,
                orderBy: { createdAt: 'desc' }
            }
        }
    });

    return (
        <div className="min-h-screen bg-slate-50 pt-28 pb-10 px-4 font-nunito">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* HEADER */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Ruang Kerja Pengurus 🛡️</h1>
                        <p className="text-slate-500">Selamat bertugas, <span className="font-bold text-blue-600">{userProfile?.fullName}</span>. Semangat menjaga keamanan RUSA!</p>
                    </div>
                    <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 shadow-sm flex items-center gap-2">
                        <span>📅</span>
                        {new Date().toLocaleDateString('id-ID', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            timeZone: 'Asia/Jakarta' // <--- PENTING: Agar selalu ikut jam WIB
                        })}
                    </div>
                </div>

                {/* STATS CARDS (To-Do List Hari Ini) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* Card 1: Laporan */}
                    <StatCard
                        title="Laporan Masuk"
                        count={pendingReports}
                        label="Perlu Tinjauan"
                        icon={<ShieldAlert size={24} />}
                        color="red"
                        href="/pengurus/laporan"
                    />

                    {/* Card 2: Konsultasi */}
                    <StatCard
                        title="Sesi Curhat Aktif"
                        count={activeConsultations}
                        label="Menunggu Respon"
                        icon={<MessageCircle size={24} />}
                        color="blue"
                        href="/pengurus/konsultasi"
                    />

                    {/* Card 3: Karya */}
                    <StatCard
                        title="Verifikasi Karya"
                        count={pendingArtworks}
                        label="Pending Approval"
                        icon={<Palette size={24} />}
                        color="purple"
                        href="/pengurus/karya"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* KOLOM KIRI: Antrian Konsultasi (Urgent) */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                <MessageCircle size={20} className="text-blue-600" />
                                Antrian Konsultasi Terbaru
                            </h2>
                            <Link href="/pengurus/konsultasi" className="text-sm text-blue-600 hover:underline font-bold">
                                Lihat Semua
                            </Link>
                        </div>

                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                            {recentConsultations.length === 0 ? (
                                <div className="p-8 text-center text-slate-400">
                                    <CheckCircle2 size={40} className="mx-auto mb-2 text-green-500" />
                                    <p>Semua sesi curhat sudah aman terkendali!</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-100">
                                    {recentConsultations.map((item) => (
                                        <div key={item.id} className="p-5 hover:bg-slate-50 transition-colors flex justify-between items-center group">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-bold text-slate-800">{item.student.fullName}</span>
                                                    <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-bold">Siswa</span>
                                                    <span className="text-xs text-slate-400 flex items-center gap-1">
                                                        • <Clock size={10} /> {new Date(item.updatedAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-slate-600 font-medium mb-1">Topik: {item.topic}</p>
                                                <p className="text-xs text-slate-500 truncate max-w-md">
                                                    "{item.messages[0]?.content || 'Memulai percakapan...'}"
                                                </p>
                                            </div>
                                            <Link
                                                href={`/konsultasi/${item.id}`} // Link langsung ke room chat
                                                className="px-4 py-2 bg-white border border-slate-200 text-slate-600 font-bold text-sm rounded-lg group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all"
                                            >
                                                Balas
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* KOLOM KANAN: Shortcut Menu */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-bold text-slate-800">Menu Cepat</h2>
                        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                            <ShortcutItem
                                href="/pengurus/laporan"
                                label="Tinjau Laporan Bullying"
                                icon={<ShieldAlert size={18} />}
                                count={pendingReports}
                            />
                            <ShortcutItem
                                href="/pengurus/karya"
                                label="Moderasi Karya Seni"
                                icon={<Palette size={18} />}
                                count={pendingArtworks}
                            />
                            <ShortcutItem
                                href="/forum"
                                label="Pantau Forum Diskusi"
                                icon={<ClipboardList size={18} />}
                            />
                        </div>

                        {/* Note Edukasi untuk Pengurus */}
                        <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100">
                            <h3 className="font-bold text-blue-800 text-sm mb-2">Panduan Moderasi</h3>
                            <p className="text-xs text-blue-600 leading-relaxed">
                                Ingat, prioritas utama adalah keamanan anak. Jika menemukan laporan bullying fisik yang serius, segera eskalasi ke Admin Utama sesuai SOP.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

// --- Komponen Pendukung ---

function StatCard({ title, count, label, icon, color, href }: any) {
    const colors: any = {
        red: "bg-red-50 text-red-600 border-red-100",
        blue: "bg-blue-50 text-blue-600 border-blue-100",
        purple: "bg-purple-50 text-purple-600 border-purple-100",
    };

    return (
        <Link href={href} className="block group">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all h-full relative overflow-hidden">
                <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-xl ${colors[color]} transition-colors`}>
                        {icon}
                    </div>
                    {count > 0 && (
                        <span className="flex h-3 w-3">
                            <span className={`animate-ping absolute inline-flex h-3 w-3 rounded-full opacity-75 bg-${color}-400`}></span>
                            <span className={`relative inline-flex rounded-full h-3 w-3 bg-${color}-500`}></span>
                        </span>
                    )}
                </div>

                <h3 className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">{title}</h3>
                <div className="flex items-end gap-2">
                    <span className="text-4xl font-extrabold text-slate-800">{count}</span>
                    <span className="text-sm text-slate-400 font-medium mb-1.5">{label}</span>
                </div>

                <div className="absolute right-4 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300">
                    <ArrowRight className="text-slate-300" />
                </div>
            </div>
        </Link>
    );
}

function ShortcutItem({ href, label, icon, count }: any) {
    return (
        <Link href={href} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors group">
            <div className="flex items-center gap-3 text-slate-600 group-hover:text-blue-600 font-bold text-sm">
                {icon}
                {label}
            </div>
            {count > 0 && (
                <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded-full font-bold">
                    {count}
                </span>
            )}
        </Link>
    );
}