"use client";

import { motion } from "framer-motion";
import { Heart, User } from "lucide-react";
import Image from "next/image";

interface ArtworkProps {
  artwork: {
    id: string;
    title: string;
    description: string | null;
    imageUrl: string;
    author: {
      fullName: string;
    };
  };
  index: number;
}

export default function ArtworkCard({ artwork, index }: ArtworkProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group break-inside-avoid mb-6" // Class untuk Masonry Layout
    >
      <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 relative">
        
        {/* GAMBAR KARYA */}
        <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
           {/* Fallback jika gambar error/loading pakai Next Image */}
           <Image 
             src={artwork.imageUrl} 
             alt={artwork.title}
             fill
             className="object-cover group-hover:scale-110 transition-transform duration-500"
             sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
           />
           
           {/* Overlay Gradient saat Hover */}
           <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
             <p className="text-white text-xs font-bold line-clamp-2">
               {artwork.description || "Tidak ada deskripsi"}
             </p>
           </div>
        </div>

        {/* INFO KARYA */}
        <div className="p-5">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-lg text-slate-800 leading-tight group-hover:text-blue-600 transition-colors">
              {artwork.title}
            </h3>
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-50">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <User size={12} />
              </div>
              <span className="text-xs font-bold text-slate-500 truncate max-w-[100px]">
                {artwork.author.fullName}
              </span>
            </div>
            
            {/* Tombol Like Visual (Belum ada fungsi DB) */}
            <button className="text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1 text-xs font-bold">
              <Heart size={14} /> Suka
            </button>
          </div>
        </div>
        
        {/* Label Pojok (Opsional) */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold text-slate-600 shadow-sm">
          Aspirasi
        </div>

      </div>
    </motion.div>
  );
}