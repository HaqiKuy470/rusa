'use client'

import { useState } from "react";
import { login } from "@/app/actions/auth"; // Import action yang baru dibuat
import { Loader2, LogIn, AlertCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    setErrorMsg("");

    // Panggil Server Action
    const result = await login(formData);

    // Jika ada return value (berarti error), tampilkan pesan
    if (result?.error) {
      setErrorMsg(result.error);
      setLoading(false);
    }
    // Jika sukses, redirect akan ditangani otomatis oleh action (via redirect next/navigation)
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-nunito">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        
        {/* Header Ilustrasi */}
        <div className="bg-blue-600 p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
             <Image src="/pattern.svg" alt="pattern" fill className="object-cover" />
          </div>
          <h1 className="text-3xl font-extrabold text-white relative z-10 tracking-tight">
            RUSA<span className="text-yellow-400">.</span>
          </h1>
          <p className="text-blue-100 mt-2 text-sm relative z-10">
            Ruang Suara Anak - Masuk ke Akunmu
          </p>
        </div>

        {/* Form Login */}
        <div className="p-8">
          
          {errorMsg && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold flex items-center gap-2 animate-pulse border border-red-100">
              <AlertCircle size={18} />
              {errorMsg}
            </div>
          )}

          <form action={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1 ml-1">Email Sekolah</label>
              <input 
                type="email" 
                name="email"
                required
                placeholder="nama@sekolah.sch.id"
                className="w-full px-5 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 bg-slate-50 font-bold text-slate-700 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1 ml-1">Kata Sandi</label>
              <input 
                type="password" 
                name="password"
                required
                placeholder="••••••••"
                className="w-full px-5 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 bg-slate-50 font-bold text-slate-700 transition-all"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-600/20 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
            >
              {loading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  <LogIn size={20} /> Masuk Sekarang
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-slate-400">
              Belum punya akun? <Link href="/register" className="text-blue-600 font-bold hover:underline">Daftar dulu yuk!</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}