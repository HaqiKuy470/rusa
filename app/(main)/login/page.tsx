import Link from "next/link";
import { loginWithGoogle } from "@/lib/actions"; // Import action tadi
import { Sparkles, ArrowLeft } from "lucide-react";
import Image from "next/image"; // Untuk logo Google

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-nunito">
      <div className="bg-white max-w-md w-full rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        
        {/* Header */}
        <div className="bg-blue-600 p-8 text-center relative overflow-hidden">
           {/* ... (Kode Header sama seperti sebelumnya) ... */}
           <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
             <Sparkles className="text-yellow-300 w-8 h-8" />
           </div>
           <h1 className="text-2xl font-bold text-white">Masuk ke RUSA</h1>
           <p className="text-blue-100 text-sm">Satu klik untuk mulai berpetualang!</p>
        </div>

        {/* TOMBOL GOOGLE */}
        <div className="p-8 pb-12">
          <form action={loginWithGoogle}>
            <button 
              type="submit" 
              className="w-full bg-white border-2 border-slate-200 hover:border-blue-400 hover:bg-blue-50 text-slate-700 font-bold py-4 rounded-2xl shadow-sm transition-all flex items-center justify-center gap-3 group"
            >
              {/* Logo Google SVG */}
              <div className="w-6 h-6 relative">
                 <Image 
                   src="https://www.svgrepo.com/show/475656/google-color.svg" 
                   alt="Google" 
                   fill 
                 />
              </div>
              <span className="group-hover:text-blue-600 transition-colors">
                Masuk dengan Google
              </span>
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-slate-400 text-xs">
              Dengan masuk, kamu setuju untuk menjadi anak baik & sopan di RUSA. 🛡️
            </p>
          </div>
        </div>

      </div>
    </main>
  );
}