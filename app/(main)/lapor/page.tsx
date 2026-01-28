import { submitReport } from "@/app/actions/submit-report";
import { ShieldCheck, LockIcon, Send } from 'lucide-react';

export default function LaporPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] py-12 px-4 flex justify-center items-start">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        
        {/* Header Card */}
        <div className="bg-blue-600 p-8 text-center text-white relative overflow-hidden">
          <div className="relative z-10">
            <ShieldCheck size={48} className="mx-auto mb-4 opacity-90" />
            <h1 className="text-2xl font-bold mb-2">Zona Aman Anti-Bullying</h1>
            <p className="text-blue-100 text-sm md:text-base">
              Jangan takut bicara. Suaramu berharga dan dilindungi. 
              Ceritakan apa yang terjadi, kami di sini untuk membantu.
            </p>
          </div>
          {/* Dekorasi Background */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500 to-blue-700 opacity-50"></div>
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
        </div>

        {/* Form Area */}
        <div className="p-8">
          <form action={submitReport} className="space-y-6">
            
            {/* Input Kategori */}
            <div className="space-y-2">
              <label htmlFor="category" className="block text-sm font-semibold text-gray-700">
                Apa jenis kejadiannya?
              </label>
              <select 
                name="category" 
                id="category"
                required
                defaultValue=""
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all bg-gray-50/50"
              >
                <option value="" disabled selected>Pilih kategori...</option>

                <option value="Bullying Fisik">Bullying Fisik (Pukul/Dorong)</option>
                <option value="Bullying Verbal">Bullying Verbal (Ejekan/Hinaan)</option>
                <option value="Cyberbullying">Cyberbullying (Di Sosmed/WA)</option>
                <option value="Pengucilan">Pengucilan / Dijauhi Teman</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>

            {/* Input Cerita */}
            <div className="space-y-2">
              <label htmlFor="content" className="block text-sm font-semibold text-gray-700">
                Ceritakan kronologinya
              </label>
              <textarea 
                name="content" 
                id="content" 
                required
                rows={5}
                placeholder="Contoh: Hari ini di kantin, aku melihat..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all bg-gray-50/50 resize-none"
              ></textarea>
              <p className="text-xs text-gray-400">Ceritakan dengan tenang, pelan-pelan saja.</p>
            </div>

            {/* Opsi Anonim */}
            <div className="bg-blue-50 p-4 rounded-xl flex items-start gap-4 border border-blue-100">
              <div className="p-2 bg-white rounded-full text-blue-600 shadow-sm">
                <LockIcon size={20} />
              </div>
              <div className="flex-1">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    name="isAnonim" 
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300" 
                  />
                  <span className="font-semibold text-gray-800">Kirim sebagai Anonim</span>
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  Namamu tidak akan ditampilkan ke publik atau guru, hanya Admin RUSA yang tahu untuk keperluan keamanan.
                </p>
              </div>
            </div>

            {/* Tombol Kirim */}
            <button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-600/20 transition-transform active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <Send size={20} />
              Kirim Laporan
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}