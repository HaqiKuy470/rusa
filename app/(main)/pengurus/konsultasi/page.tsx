import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { MessageCircle, Clock, CheckCircle2, User } from "lucide-react";

export default async function AntrianKonsultasiPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Proteksi: Pastikan Pengurus
  const viewer = await prisma.profile.findUnique({ where: { id: user.id } });
  if (viewer?.role === 'ANAK') redirect("/dashboard");

  // Ambil semua konsultasi yang OPEN
  const consultations = await prisma.consultation.findMany({
    where: { status: 'OPEN' },
    orderBy: { updatedAt: 'desc' }, // Yang ada chat baru naik ke atas
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
      <div className="max-w-4xl mx-auto space-y-6">
        
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-600/20">
            <MessageCircle size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Antrian Curhat</h1>
            <p className="text-slate-500">Daftar siswa yang menunggu balasan kakak.</p>
          </div>
        </div>

        {consultations.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center">
            <CheckCircle2 size={48} className="mx-auto mb-4 text-green-500" />
            <h3 className="text-lg font-bold text-slate-800">Semua Aman!</h3>
            <p className="text-slate-400">Tidak ada antrian konsultasi saat ini.</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {consultations.map((item) => (
              <Link 
                key={item.id} 
                href={`/konsultasi/${item.id}`} // <--- Link menuju Room Chat
                className="group bg-white p-5 rounded-2xl border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all flex justify-between items-center"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-slate-900 text-lg">{item.student?.fullName || "Anonim"}</span>
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-bold rounded-full border border-blue-100 flex items-center gap-1">
                      <User size={10} /> Siswa
                    </span>
                  </div>
                  
                  <p className="font-medium text-slate-600 text-sm mb-1">Topik: {item.topic}</p>
                  
                  <p className="text-slate-400 text-xs truncate max-w-md flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${item.messages[0]?.isFromUser ? 'bg-red-500 animate-pulse' : 'bg-gray-300'}`}></span>
                    {item.messages[0]?.isFromUser ? "Menunggu balasan: " : "Anda: "}
                    "{item.messages[0]?.content || "Memulai percakapan..."}"
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-xs text-slate-400 mb-2 flex items-center justify-end gap-1">
                    <Clock size={12} />
                    {new Date(item.updatedAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <span className="px-4 py-2 bg-blue-50 text-blue-600 font-bold text-sm rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    Balas
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}