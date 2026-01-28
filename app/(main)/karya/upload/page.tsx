'use client'

import { useState } from "react";
import { uploadArtwork } from "@/app/actions/upload-artwork";
import { UploadCloud, Image as ImageIcon, Loader2, LockIcon, User } from "lucide-react";
import Image from "next/image";

export default function UploadKaryaPage() {
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isAnonim, setIsAnonim] = useState(false); // State untuk toggle anonim

  // Handle saat user memilih file gambar
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validasi ukuran di sisi client (UX lebih cepat)
      if (file.size > 2 * 1024 * 1024) {
        alert("Gambarnya terlalu besar! Maksimal 2MB ya.");
        e.target.value = ""; // Reset input
        return;
      }
      // Buat preview gambar
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  };

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    setErrorMsg("");
    
    // Panggil Server Action
    const result = await uploadArtwork(formData);
    
    // Jika ada error dari server, tampilkan
    if (result?.error) {
      setErrorMsg(result.error);
      setLoading(false);
    }
    // Jika sukses, redirect akan ditangani otomatis oleh action
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] pt-28 pb-10 px-4 font-nunito flex justify-center">
      <div className="max-w-xl w-full">
        
        {/* Header Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-purple-600 mb-2">Upload Karyamu 🎨</h1>
          <p className="text-slate-500">
            Tunjukkan bakatmu pada teman-teman sekolah! <br/>
            <span className="text-xs bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-bold mt-2 inline-block shadow-sm">
              🛡️ Akan diperiksa Kakak Pengurus dulu ya
            </span>
          </p>
        </div>

        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200 relative overflow-hidden">
          
          {/* Notifikasi Error */}
          {errorMsg && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-bold text-center animate-pulse">
              ⚠️ {errorMsg}
            </div>
          )}

          <form action={handleSubmit} className="space-y-6">
            
            {/* 1. Area Upload Gambar (Drag & Drop Look) */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700 ml-1">Pilih Gambarmu</label>
              <div className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all ${preview ? 'border-purple-300 bg-purple-50' : 'border-slate-300 hover:border-purple-400 hover:bg-slate-50'}`}>
                <input 
                  type="file" 
                  name="file" 
                  accept="image/*"
                  onChange={handleFileChange}
                  required
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                
                {preview ? (
                  <div className="relative h-48 w-full group">
                    <Image 
                        src={preview} 
                        alt="Preview" 
                        fill 
                        className="object-contain rounded-lg" 
                        unoptimized // Supaya preview blob local bisa tampil
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg backdrop-blur-sm">
                      <p className="text-white font-bold text-sm bg-black/50 px-4 py-2 rounded-full">Ganti Gambar</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3 text-slate-400">
                    <div className="w-16 h-16 bg-purple-100 text-purple-500 rounded-full flex items-center justify-center shadow-inner">
                      <UploadCloud size={32} />
                    </div>
                    <p className="text-sm font-medium">Klik atau geser gambar ke sini</p>
                    <p className="text-xs text-slate-400">Maksimal 2MB (JPG/PNG)</p>
                  </div>
                )}
              </div>
            </div>

            {/* 2. Judul Karya */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700 ml-1">Judul Karya</label>
              <input 
                type="text" 
                name="title"
                required
                placeholder="Contoh: Robot Masa Depan..."
                className="w-full px-5 py-3 rounded-xl border border-slate-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 bg-slate-50 font-bold text-slate-700 transition-all placeholder:font-normal"
              />
            </div>

            {/* 3. Toggle Anonim (Fitur Baru) */}
            <div 
                className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between select-none ${isAnonim ? 'bg-slate-800 border-slate-800 shadow-md' : 'bg-white border-slate-200 hover:border-blue-300'}`}
                onClick={() => setIsAnonim(!isAnonim)}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isAnonim ? 'bg-slate-600 text-white' : 'bg-blue-100 text-blue-600'}`}>
                  {isAnonim ? <LockIcon size={22} /> : <User size={22} />}
                </div>
                <div>
                  <p className={`text-sm font-bold ${isAnonim ? 'text-white' : 'text-slate-700'}`}>
                    {isAnonim ? "Mode Rahasia Aktif 🕵️" : "Tampilkan Nama Saya"}
                  </p>
                  <p className={`text-xs ${isAnonim ? 'text-slate-300' : 'text-slate-500'}`}>
                    {isAnonim ? "Namamu disembunyikan sebagai 'Anonim'" : "Karya dipajang dengan nama profilmu"}
                  </p>
                </div>
              </div>
              
              {/* Checkbox asli (Hidden) agar bisa dibaca FormData */}
              <input type="checkbox" name="isAnonim" checked={isAnonim} readOnly className="hidden" />
              
              {/* Visual Checkbox */}
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${isAnonim ? 'border-green-400 bg-green-400' : 'border-slate-300 bg-slate-100'}`}>
                 {isAnonim && <span className="text-white text-xs font-bold">✓</span>}
              </div>
            </div>

            {/* 4. Deskripsi */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700 ml-1">Cerita Dibalik Karya</label>
              <textarea 
                name="description"
                rows={4}
                placeholder="Ceritakan sedikit tentang karyamu ini..."
                className="w-full px-5 py-3 rounded-xl border border-slate-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 bg-slate-50 text-slate-700 resize-none transition-all"
              ></textarea>
            </div>

            {/* Tombol Submit */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-600/20 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={24} className="animate-spin" />
                  Mengirim...
                </>
              ) : (
                <>
                  <ImageIcon size={24} />
                  Kirim Karyaku!
                </>
              )}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}