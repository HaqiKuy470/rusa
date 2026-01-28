import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";
import { sendMessage, closeConsultation } from "@/app/actions/send-message"; 
import { redirect } from "next/navigation";
import { Send, CheckCircle, ArrowLeft, User, Shield } from "lucide-react";
import Link from "next/link";

// 1. Definisikan Tipe Props dengan Promise (Khusus Next.js 15/16)
type Props = {
  params: Promise<{ id: string }>
}

// 2. Ubah argumen fungsi menerima 'props'
export default async function ChatRoomPage(props: Props) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // 3. Lakukan AWAIT pada props.params sebelum mengambil ID
  const params = await props.params;
  const consultationId = params.id;

  // --- Sisa kode ke bawah sama persis seperti sebelumnya ---
  
  const consultation = await prisma.consultation.findUnique({
    where: { id: consultationId },
    include: {
      student: true,
      messages: { orderBy: { createdAt: 'asc' } }
    }
  });

  if (!consultation) return <div>Data tidak ditemukan</div>;

  const isViewerStudent = user.id === consultation.studentId;
  
  const viewerProfile = await prisma.profile.findUnique({ where: { id: user.id } });
  const isStaff = viewerProfile?.role === 'PENGURUS' || viewerProfile?.role === 'ADMIN';

  if (!isViewerStudent && !isStaff) {
    redirect("/dashboard"); 
  }

  const chatPartnerName = isViewerStudent ? "Kakak Pengurus RUSA" : consultation.student.fullName;
  const chatPartnerRole = isViewerStudent ? "Konselor" : "Siswa";

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-4 px-4 flex justify-center">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[80vh]">
        
        {/* HEADER CHAT */}
        <div className="bg-white p-4 border-b border-slate-100 flex items-center justify-between shadow-sm z-10">
          <div className="flex items-center gap-3">
            <Link href={isStaff ? "/pengurus/konsultasi" : "/konsultasi"} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <ArrowLeft size={20} className="text-slate-600" />
            </Link>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isViewerStudent ? 'bg-blue-100 text-blue-600' : 'bg-yellow-100 text-yellow-600'}`}>
                {isViewerStudent ? <Shield size={20} /> : <User size={20} />}
              </div>
              <div>
                <h2 className="font-bold text-slate-900 text-sm md:text-base">{chatPartnerName}</h2>
                <p className="text-xs text-slate-500 flex items-center gap-1">
                  {chatPartnerRole} • {consultation.status === 'OPEN' ? '🟢 Online' : '🔴 Selesai'}
                </p>
              </div>
            </div>
          </div>

          {/* Tombol Selesai (Hanya untuk Pengurus) */}
          {isStaff && consultation.status === 'OPEN' && (
            <form action={closeConsultation.bind(null, consultation.id)}>
                <button className="text-xs font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-lg hover:bg-green-100 transition-colors border border-green-200">
                    ✅ Tandai Selesai
                </button>
            </form>
          )}
        </div>

        {/* AREA CHAT (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#FDFBF7]">
            <div className="text-center py-4">
                <span className="px-3 py-1 bg-slate-100 text-slate-500 text-xs rounded-full font-medium">
                    Topik: {consultation.topic}
                </span>
            </div>

            {consultation.messages.map((msg) => {
                const isMe = (isViewerStudent && msg.isFromUser) || (!isViewerStudent && !msg.isFromUser);

                return (
                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                            isMe 
                                ? 'bg-blue-600 text-white rounded-tr-none' 
                                : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
                        }`}>
                            <p>{msg.content}</p>
                            <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-blue-200' : 'text-slate-400'}`}>
                                {new Date(msg.createdAt).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'})}
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>

        {/* INPUT AREA */}
        {consultation.status === 'OPEN' ? (
            <div className="p-4 bg-white border-t border-slate-100">
                <form action={sendMessage} className="flex gap-2">
                    <input type="hidden" name="consultationId" value={consultation.id} />
                    <input 
                        type="text" 
                        name="content"
                        autoComplete="off"
                        placeholder="Tulis pesan..."
                        className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 bg-slate-50 transition-all"
                        required
                    />
                    <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl transition-colors shadow-lg shadow-blue-600/20 active:scale-95">
                        <Send size={20} />
                    </button>
                </form>
            </div>
        ) : (
            <div className="p-4 bg-slate-50 text-center border-t border-slate-200">
                <p className="text-slate-500 text-sm flex items-center justify-center gap-2">
                    <CheckCircle size={16} /> Sesi konsultasi ini telah selesai.
                </p>
            </div>
        )}

      </div>
    </div>
  );
}