"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { 
  Heart, Shield, Ear, Mic, Lock, MessageCircle, 
  HelpingHand, PenTool, Sparkles 
} from "lucide-react";
import { useRef } from "react";

// Variabel Animasi
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

export default function Home() {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: targetRef, offset: ["start end", "end start"] });

  return (
    <main className="min-h-screen bg-[#FDFBF7] font-nunito text-slate-700 selection:bg-yellow-200">
      {/* ========================================================
          1. HERO SECTION: VALIDASI PERASAAN ANAK
      ======================================================== */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        {/* Background Lebih Kalem (Warm/Safe Vibes) */}
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-yellow-100/60 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-100/40 rounded-full blur-[100px]" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-white border border-slate-200 rounded-full shadow-sm text-slate-600 text-sm font-semibold mb-8">
              <Shield size={16} className="text-blue-500" />
              Ruang Aman, Rahasia Terjaga, Bebas Bullying
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-800 leading-[1.15] mb-8 tracking-tight">
              Suaramu Berharga, <br/>
              <span className="text-blue-600">Kami Ada</span> untuk <span className="text-yellow-500 underline decoration-wavy decoration-2 underline-offset-4">Mendengar.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed">
              Punya cerita sedih, ide hebat, atau harapan untuk kotamu? 
              Jangan dipendam sendiri. Di RUSA, kamu bisa bercerita apa saja dengan aman. 
              Kami menjagamu.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/karya/upload" className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-xl shadow-blue-100 transition-all flex items-center gap-3 hover:-translate-y-1">
                <Mic size={20} /> Suarakan Isi Hatimu
              </Link>
              <Link href="/konsultasi" className="px-8 py-4 bg-white border-2 border-slate-100 hover:border-yellow-400 text-slate-600 font-bold rounded-2xl transition-all flex items-center gap-3">
                <MessageCircle size={20} /> Teman Curhat
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ========================================================
          2. EMPATHY SECTION: MASALAH YANG DIHADAPI ANAK
      ======================================================== */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-slate-800 mb-6">
                Kadang, Bercerita itu <br/> Terasa Menakutkan...
              </h2>
              <div className="space-y-6">
                {[
                  "Takut diejek teman kalau punya pendapat beda.",
                  "Bingung mau cerita ke siapa soal masalah di sekolah.",
                  "Merasa suara anak kecil tidak didengarkan orang dewasa.",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-500 mt-1 shrink-0">
                      <Lock size={16} />
                    </div>
                    <p className="text-slate-600 text-lg">{item}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-blue-50 rounded-[3rem] p-10 relative overflow-hidden text-center"
            >
              <Heart className="w-24 h-24 text-blue-200 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-slate-800 mb-4">Tapi di Sini, Kamu Aman.</h3>
              <p className="text-slate-600">
                RUSA dibuat khusus agar kamu bisa melepas beban itu. Kamu boleh pakai nama samaran, dan ada kakak Pengurus yang siap melindungi ceritamu dari komentar jahat.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ========================================================
          3. FITUR UTAMA (FOKUS PADA ASPIRASI & CURHAT)
      ======================================================== */}
      <section className="py-24 px-6 bg-[#FDFBF7]" ref={targetRef}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-slate-800">Cara Kami Menjagamu</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Mic size={32} className="text-blue-600" />}
              title="Suarakan Aspirasi"
              desc="Punya ide untuk sekolah atau kotamu? Tuliskan di sini. Suaramu akan diteruskan ke pihak yang tepat (seperti Forum Anak) agar didengar."
            />
            <FeatureCard 
              icon={<Shield size={32} className="text-blue-600" />}
              title="Zona Anti-Bullying"
              desc="Tidak perlu takut komentar jahat. Sistem RUSA otomatis memblokir kata kasar, jadi kolom komentar tetap adem dan saling dukung."
            />
            <FeatureCard 
              icon={<HelpingHand size={32} className="text-blue-600" />}
              title="Konsultasi Sahabat"
              desc="Kalau masalahmu terlalu berat untuk diceritakan ke publik, ada 'Ruang Curhat' privat dengan kakak pendamping yang ramah."
            />
          </div>
        </div>
      </section>

      {/* ========================================================
          4. DINDING SUARA (PENGGANTI SHOWCASE PAMERAN)
          Fokus: Kutipan Aspirasi / Cerita Pendek
      ======================================================== */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-800">Dinding Suara Kita 📣</h2>
              <p className="text-slate-500 mt-2">Apa yang sedang dirasakan teman-temanmu?</p>
            </div>
            <Link href="/galeri" className="text-blue-600 font-bold hover:underline">Baca Semua →</Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card Aspirasi 1 */}
            <VoiceCard 
              color="bg-yellow-50 border-yellow-100"
              tag="Harapan"
              text="Aku berharap di tamanku ada lebih banyak lampu, supaya kalau sore aku pulang les tidak takut gelap."
              author="Siswa SD, 10 Tahun"
            />
            {/* Card Aspirasi 2 */}
            <VoiceCard 
              color="bg-blue-50 border-blue-100"
              tag="Opini"
              text="Kenapa ya orang dewasa sering main HP waktu makan? Padahal aku ingin cerita soal sekolahku."
              author="Anonim"
            />
             {/* Card Aspirasi 3 */}
             <VoiceCard 
              color="bg-rose-50 border-rose-100"
              tag="Perasaan"
              text="Hari ini aku senang sekali karena berhasil presentasi tanpa gugup. Terima kasih RUSA sudah kasih tips kemarin!"
              author="Bintang Kecil"
            />
          </div>
        </div>
      </section>

      {/* ========================================================
          3.5. SECTION AJAKAN SOSIAL (FORUM DISKUSI) - BARU!
          Fokus: Interaksi Teman Sebaya & Komunitas
      ======================================================== */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto bg-indigo-600 rounded-[3rem] p-8 md:p-16 relative overflow-hidden text-white shadow-2xl shadow-indigo-200">
          
          {/* Background Dekorasi (Pattern) */}
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')]"></div>
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-pink-500 rounded-full blur-3xl opacity-40"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-400 rounded-full blur-3xl opacity-40"></div>

          <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
            
            {/* KIRI: Copywriting Ajakan */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1 bg-white/10 backdrop-blur-md rounded-full text-indigo-100 text-xs font-bold mb-6 border border-white/20">
                <Sparkles size={12} className="text-yellow-400" /> Komunitas Seru RUSA
              </div>
              
              <h2 className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight">
                Cari Teman Baru? <br/>
                <span className="text-yellow-400">Ngobrol Yuk!</span> 👋
              </h2>
              
              <p className="text-indigo-100 text-lg mb-8 leading-relaxed">
                Bosan main sendirian? Di <strong>Forum Sahabat RUSA</strong>, kamu bisa bahas hobi, kartun favorit, atau PR sekolah bareng teman-teman se-Indonesia. 
                Tenang, kakak pengurus selalu memantau agar obrolan tetap asik!
              </p>

              <div className="flex flex-wrap gap-4">
                <Link href="/forum" className="px-8 py-4 bg-yellow-400 hover:bg-yellow-500 text-indigo-900 font-extrabold rounded-2xl shadow-lg transition-transform transform hover:-translate-y-1 flex items-center gap-2">
                  <MessageCircle size={20} /> Gabung Forum
                </Link>
                <div className="flex items-center gap-2 text-indigo-200 text-sm font-semibold px-4">
                  <Shield size={16} /> 100% Dimoderasi
                </div>
              </div>
            </motion.div>

            {/* KANAN: Visualisasi Chat (Floating Bubbles) */}
            <div className="relative h-[300px] w-full hidden md:block">
              {/* Bubble 1 */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-0 right-10 bg-white text-slate-700 p-4 rounded-t-2xl rounded-bl-2xl shadow-lg max-w-[250px]"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-green-400 rounded-full"></div>
                  <span className="text-xs font-bold text-slate-400">Bud</span>
                </div>
                <p className="text-sm font-bold">"Ada yang suka main Roblox gak? Mabar yuk nanti sore!" 🎮</p>
              </motion.div>

              {/* Bubble 2 */}
              <motion.div 
                animate={{ y: [0, 15, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute top-32 left-10 bg-white text-slate-700 p-4 rounded-t-2xl rounded-br-2xl shadow-lg max-w-[250px] z-10"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-pink-400 rounded-full"></div>
                  <span className="text-xs font-bold text-slate-400">Siti</span>
                </div>
                <p className="text-sm font-bold">"Wah ayo! Tapi aku selesaikan PR Matematika dulu yaa 📚"</p>
              </motion.div>

              {/* Bubble 3 (Pengurus) */}
              <motion.div 
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute bottom-0 right-20 bg-blue-600 text-white p-3 rounded-2xl shadow-xl border-2 border-blue-400 max-w-[220px]"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Shield size={12} className="text-yellow-400"/>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-200">Pengurus</span>
                </div>
                <p className="text-xs">"Ingat jaga sopan santun ya adik-adik! Selamat bermain! 👍"</p>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================
          5. MITRA & KEBERLANJUTAN (WAJIB UNTUK PKM)
      ======================================================== */}
      <section className="py-24 px-6 bg-slate-900 text-white rounded-t-[3rem] mt-12">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          
          <div>
            <span className="text-yellow-400 font-bold tracking-widest text-sm uppercase">Program Berkelanjutan</span>
            <h2 className="text-4xl font-extrabold mt-4 mb-6">Suaramu Tidak Berhenti Di Sini.</h2>
            <p className="text-slate-300 text-lg mb-8 leading-relaxed">
              RUSA dikelola bersama <strong>Forum Anak Kota Malang</strong>. 
              Aspirasi terpilih akan dipajang di <strong>"Pojok Reflektorusa"</strong> dan dibahas dalam pertemuan kota. 
              Kami memastikan suaramu sampai ke telinga yang tepat.
            </p>
            
            <div className="flex gap-4">
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10 text-center min-w-[100px]">
                <h4 className="font-bold text-2xl text-yellow-400">100+</h4>
                <span className="text-xs text-slate-400">Suara Masuk</span>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10 text-center min-w-[100px]">
                <h4 className="font-bold text-2xl text-yellow-400">Bulanan</h4>
                <span className="text-xs text-slate-400">Update Pojok</span>
              </div>
            </div>
          </div>

          <div className="bg-white text-slate-900 p-8 rounded-3xl relative">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-slate-200 rounded-full"></div>
              <div>
                <h4 className="font-bold">Forum Anak Kota Malang</h4>
                <p className="text-xs text-slate-500">Mitra Pengelola Resmi</p>
              </div>
            </div>
            <div className="space-y-4">
              <p className="text-sm font-medium text-slate-600">
                "Kami berkomitmen menjadikan RUSA sebagai jembatan komunikasi. 
                Setiap bulan, kami menyeleksi suara anak untuk dipublikasikan di media edukasi kami."
              </p>
              <div className="h-px bg-slate-100 w-full"></div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-400">SCAN UNTUK GABUNG</span>
                {/* QR Placeholder */}
                <div className="w-10 h-10 bg-slate-900 text-white text-[8px] flex items-center justify-center font-bold">QR</div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-6 border-t border-slate-800">
        <div className="max-w-6xl mx-auto text-center md:text-left flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-2xl font-extrabold text-white mb-1">RUSA<span className="text-blue-500">.</span></h3>
            <p className="text-sm">Ruang Suara Anak &copy; 2026</p>
          </div>
          <div className="flex gap-6 text-sm font-medium">
             <Link href="#" className="hover:text-white transition-colors">Panduan Keamanan</Link>
             <Link href="#" className="hover:text-white transition-colors">Lapor Masalah</Link>
             <Link href="#" className="hover:text-white transition-colors">Kontak Mitra</Link>
          </div>
        </div>
      </footer>

    </main>
  );
}

// Komponen Kecil untuk Rapi
function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-800 mb-3">{title}</h3>
      <p className="text-slate-500 leading-relaxed text-sm">
        {desc}
      </p>
    </div>
  )
}

function VoiceCard({ color, tag, text, author }: { color: string, tag: string, text: string, author: string }) {
  return (
    <div className={`p-6 rounded-3xl border ${color} relative`}>
      <span className="px-3 py-1 bg-white rounded-full text-[10px] font-bold uppercase tracking-wider text-slate-500 border border-slate-100 mb-4 inline-block">
        {tag}
      </span>
      <p className="text-lg font-medium text-slate-700 mb-6 leading-relaxed">
        "{text}"
      </p>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-slate-200" />
        <span className="text-sm font-bold text-slate-500">{author}</span>
      </div>
    </div>
  )
}