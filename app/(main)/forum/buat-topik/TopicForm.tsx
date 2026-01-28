'use client'

import { useState } from "react";
import { createTopic } from "@/app/actions/create-topic";
import { Loader2, Send, User, LockIcon, Hash } from "lucide-react";

export default function TopicForm({ categories }: { categories: any[] }) {
  const [loading, setLoading] = useState(false);
  const [isAnonim, setIsAnonim] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    await createTopic(formData);
    // Redirect ditangani di server action
  };

  return (
    <form action={handleSubmit} className="space-y-6">
      
      {/* 1. Pilih Kategori */}
      <div className="space-y-2">
        <label className="block text-sm font-bold text-slate-700 ml-1">Pilih Kategori</label>
        <div className="relative">
          <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <select 
            name="categoryId" 
            required
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 bg-slate-50 appearance-none font-bold text-slate-600"
          >
            <option value="" disabled selected>-- Pilih Topik Diskusi --</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                 {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 2. Judul */}
      <div className="space-y-2">
        <label className="block text-sm font-bold text-slate-700 ml-1">Judul Diskusi</label>
        <input 
          type="text" 
          name="title"
          required
          placeholder="Contoh: Cara mengatasi grogi saat presentasi..."
          className="w-full px-5 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 bg-slate-50 font-bold text-slate-700"
        />
      </div>

      {/* 3. Toggle Anonim */}
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
              {isAnonim ? "Mode Anonim Aktif 🕵️" : "Pakai Identitas Asli"}
            </p>
            <p className={`text-xs ${isAnonim ? 'text-slate-300' : 'text-slate-500'}`}>
              {isAnonim ? "Namamu tidak akan muncul di postingan ini" : "Orang lain bisa melihat profilmu"}
            </p>
          </div>
        </div>
        <input type="checkbox" name="isAnonim" checked={isAnonim} readOnly className="hidden" />
        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${isAnonim ? 'border-green-400 bg-green-400' : 'border-slate-300 bg-slate-100'}`}>
            {isAnonim && <span className="text-white text-xs font-bold">✓</span>}
        </div>
      </div>

      {/* 4. Isi Konten */}
      <div className="space-y-2">
        <label className="block text-sm font-bold text-slate-700 ml-1">Isi Diskusi</label>
        <textarea 
          name="content"
          required
          rows={6}
          placeholder="Tulis apa yang ingin kamu diskusikan..."
          className="w-full px-5 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 bg-slate-50 text-slate-700 resize-none leading-relaxed"
        ></textarea>
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-600/20 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
      >
        {loading ? <Loader2 size={24} className="animate-spin" /> : <Send size={24} />}
        Posting Diskusi
      </button>

    </form>
  );
}