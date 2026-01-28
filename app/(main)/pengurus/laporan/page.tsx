import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";
import { updateReportStatus } from "@/app/actions/moderation";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle, XCircle, AlertTriangle, LockIcon, Calendar } from "lucide-react";

export default async function ModerasiLaporanPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Cek Role (Hanya Pengurus/Admin)
  const viewer = await prisma.profile.findUnique({ where: { id: user.id } });
  if (viewer?.role === 'ANAK') redirect("/dashboard");

  // Ambil Laporan (Pending ditaruh paling atas)
  const reports = await prisma.report.findMany({
    orderBy: [
      { status: 'asc' }, // PENDING (abjad P) akan muncul sebelum REJECTED, kita sort manual nanti biar rapi
      { createdAt: 'desc' }
    ],
    include: {
      reporter: true // Ambil data pelapor
    }
  });

  // Pisahkan Pending dan History biar rapi
  const pendingReports = reports.filter(r => r.status === 'PENDING');
  const historyReports = reports.filter(r => r.status !== 'PENDING');

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-10 px-4 font-nunito">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/pengurus" className="p-2 bg-white rounded-full border border-slate-200 hover:bg-slate-100 transition-colors">
            <ArrowLeft size={20} className="text-slate-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Tinjau Laporan 🛡️</h1>
            <p className="text-slate-500 text-sm">Validasi laporan masuk sebelum ditindaklanjuti.</p>
          </div>
        </div>

        {/* SECTION 1: Laporan Baru (PENDING) */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-red-600 flex items-center gap-2">
            <AlertTriangle size={20} /> Perlu Tinjauan ({pendingReports.length})
          </h2>

          {pendingReports.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-400">
              <CheckCircle size={40} className="mx-auto mb-2 text-green-500" />
              <p>Tidak ada laporan baru yang menunggu.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {pendingReports.map((item) => (
                <ReportCard key={item.id} item={item} isPending={true} />
              ))}
            </div>
          )}
        </div>

        {/* SECTION 2: Riwayat Laporan (History) */}
        <div className="space-y-4 pt-8 border-t border-slate-200">
          <h2 className="text-lg font-bold text-slate-700">Riwayat Penanganan</h2>
          <div className="grid gap-4 opacity-75">
            {historyReports.map((item) => (
              <ReportCard key={item.id} item={item} isPending={false} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

// Komponen Card Laporan
function ReportCard({ item, isPending }: { item: any, isPending: boolean }) {
  // Server Action Bindings
  const approveAction = updateReportStatus.bind(null, item.id, 'APPROVED');
  const rejectAction = updateReportStatus.bind(null, item.id, 'REJECTED');

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6">
      {/* Kolom Info */}
      <div className="flex-1 space-y-3">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full uppercase tracking-wider">
            {item.category}
          </span>
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Calendar size={12} />
            {new Date(item.createdAt).toLocaleDateString('id-ID', { dateStyle: 'full' })}
          </span>
        </div>
        
        <p className="text-slate-800 text-lg font-medium leading-relaxed">
          "{item.content}"
        </p>

        {/* Info Pelapor */}
        <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-50 p-3 rounded-lg w-fit">
          {item.isAnonim ? (
            <>
              <LockIcon size={16} className="text-purple-600" />
              <span className="font-bold text-purple-700">Pelapor Anonim</span>
              <span className="text-xs text-slate-400"> (ID Asli: {item.reporter.fullName})</span> 
              {/* Pengurus tetap bisa lihat nama asli untuk keamanan, tapi ada tanda Anonim */}
            </>
          ) : (
            <>
              <div className="w-5 h-5 rounded-full bg-blue-200 flex items-center justify-center text-[10px] font-bold text-blue-700">
                {item.reporter.fullName.charAt(0)}
              </div>
              <span className="font-semibold">{item.reporter.fullName}</span>
            </>
          )}
        </div>
      </div>

      {/* Kolom Aksi */}
      <div className="flex flex-col justify-center gap-3 min-w-[150px] border-l border-slate-100 pl-0 md:pl-6">
        {isPending ? (
          <>
            <form action={approveAction}>
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all text-sm shadow-sm hover:shadow-md">
                <CheckCircle size={16} />
                Selesai
              </button>
            </form>
            <form action={rejectAction}>
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white border border-red-200 text-red-600 hover:bg-red-50 font-bold rounded-xl transition-all text-sm">
                <XCircle size={16} />
                Tolak
              </button>
            </form>
          </>
        ) : (
          <div className={`text-center px-4 py-2 rounded-xl font-bold text-sm border ${
            item.status === 'APPROVED' 
              ? 'bg-green-50 text-green-700 border-green-200' 
              : 'bg-red-50 text-red-700 border-red-200'
          }`}>
            {item.status === 'APPROVED' ? 'Terselesaikan' : 'Ditolak'}
          </div>
        )}
      </div>
    </div>
  );
}