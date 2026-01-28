import Navbar from "@/components/Navbar";
import ArtworkCard from "@/components/ArtworkCard";
import { getApprovedArtworks } from "@/lib/actions";
import { Sparkles, Search } from "lucide-react";

// Revalidate data setiap 60 detik agar tidak perlu build ulang saat ada karya baru
export const revalidate = 60; 

export default async function GaleriPage() {
  // 1. Ambil data dari Server Action
  const artworks = await getApprovedArtworks();

  return (
    <main className="min-h-screen bg-[#FDFBF7] font-nunito">
      <Navbar />

      {/* HEADER SECTION */}
      <section className="pt-32 pb-12 px-6 text-center bg-white border-b border-slate-100 relative overflow-hidden">
        {/* Dekorasi */}
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
        <div className="absolute top-10 right-10 w-32 h-32 bg-yellow-200 rounded-full blur-3xl opacity-50"></div>
        
        <div className="max-w-3xl mx-auto relative z-10">
          <span className="text-blue-600 font-bold tracking-widest text-xs uppercase bg-blue-50 px-3 py-1 rounded-full mb-4 inline-block">
            Galeri & Aspirasi
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 mb-6">
            Dinding Suara <span className="text-blue-500">RUSA</span> 🎨
          </h1>
          <p className="text-slate-500 text-lg leading-relaxed mb-8">
            Temukan cerita, harapan, dan karya seni dari teman-teman seluruh Indonesia. 
            Semua karya di sini sudah melalui proses kurasi agar aman dan positif.
          </p>

          {/* SEARCH BAR SEDERHANA */}
          <div className="relative max-w-lg mx-auto">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400">
              <Search size={20} />
            </div>
            <input 
              type="text" 
              placeholder="Cari judul karya atau nama teman..." 
              className="w-full pl-12 pr-4 py-4 rounded-full border-2 border-slate-100 focus:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-50 transition-all shadow-sm text-slate-600"
            />
          </div>
        </div>
      </section>

      {/* GALLERY GRID SECTION */}
      <section className="py-12 px-4 md:px-8 max-w-7xl mx-auto min-h-[500px]">
        
        {artworks.length > 0 ? (
          // MASONRY GRID (CSS Columns)
          <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
            {artworks.map((art, index) => (
              <ArtworkCard key={art.id} artwork={art} index={index} />
            ))}
          </div>
        ) : (
          // EMPTY STATE (Jika belum ada karya)
          <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200">
            <div className="bg-yellow-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles className="text-yellow-500 w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-slate-700 mb-2">Wah, Belum Ada Karya!</h3>
            <p className="text-slate-500 mb-8 max-w-md mx-auto">
              Dinding suara masih sepi nih. Yuk, jadi yang pertama memajang karyamu di sini!
            </p>
            <a href="//karya/upload" className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
              Kirim Karya Sekarang
            </a>
          </div>
        )}

      </section>

    </main>
  );
}