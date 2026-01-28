import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";
import { startConsultation } from "@/app/actions/start-consultation";
import { MessageCircleHeart, Send, Clock, ChevronRight, PlusCircle } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function KonsultasiPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Ambil data konsultasi milik user ini
  const myConsultations = await prisma.consultation.findMany({
    where: { studentId: user.id },
    orderBy: { updatedAt: 'desc' },
    include: {
      messages: {
        take: 1,
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  return (
    <div className="min-h-screen bg-[#FDFBF7] pt-28 pb-10 px-4">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* KOLOM KIRI: Form Curhat Baru */}
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-blue-100 sticky top-28">
            <div className="flex items-center gap-3 mb-4 text-blue-600">
              <MessageCircleHeart size={28} />
              <h2 className="text-xl font-bold text-gray-900">Mulai Curhat</h2>
            </div>
            
            <p className="text-sm text-gray-500 mb-6">
              Ceritakan masalahmu secara privat. Kakak pendamping siap mendengarkan.
            </p>

            <form action={startConsultation} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">Topik Masalah</label>
                <input 
                  type="text" 
                  name="topic"
                  required
                  placeholder="Misal: Bertengkar dengan teman..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 bg-gray-50 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">Pesan Pertamamu</label>
                <textarea 
                  name="message"
                  required
                  rows={4}
                  placeholder="Halo Kak, aku mau cerita..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 bg-gray-50 text-sm resize-none"
                ></textarea>
              </div>

              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-blue-600/20">
                <Send size={18} />
                Kirim & Mulai Chat
              </button>
            </form>
          </div>
        </div>

        {/* KOLOM KANAN: Riwayat Chat */}
        <div className="md:col-span-2 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Riwayat Percakapan</h1>
            <p className="text-gray-500">Lanjutkan obrolan yang belum selesai.</p>
          </div>

          {myConsultations.length === 0 ? (
            // State Kosong
            <div className="bg-white p-10 rounded-2xl border border-dashed border-gray-300 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                <PlusCircle size={32} />
              </div>
              <h3 className="text-gray-900 font-bold mb-1">Belum ada obrolan</h3>
              <p className="text-gray-400 text-sm">Yuk mulai curhat di form sebelah kiri!</p>
            </div>
          ) : (
            // List Chat
            <div className="grid gap-4">
              {myConsultations.map((item) => (
                <Link 
                  href={`/konsultasi/${item.id}`} 
                  key={item.id}
                  className="group bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all flex justify-between items-center"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-bold text-gray-900 truncate">{item.topic}</h3>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        item.status === 'OPEN' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {item.status === 'OPEN' ? 'Aktif' : 'Selesai'}
                      </span>
                    </div>
                    <p className="text-gray-500 text-sm truncate flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                      {item.messages[0]?.content || "Memulai percakapan..."}
                    </p>
                    <div className="flex items-center gap-2 mt-3 text-xs text-gray-400">
                      <Clock size={12} />
                      {new Date(item.updatedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <ChevronRight size={20} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}