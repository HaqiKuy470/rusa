import Link from 'next/link';
import { CheckCircle, Home } from 'lucide-react';

export default function LaporSuksesPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col justify-center items-center px-4 text-center">
      <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl max-w-md w-full border border-gray-100">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
          <CheckCircle size={40} />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-3">Terima Kasih atas Keberanianmu!</h1>
        <p className="text-gray-600 mb-8 leading-relaxed">
          Laporanmu sudah kami terima. Tim RUSA akan segera membacanya. 
          Ingat, kamu tidak sendirian.
        </p>

        <div className="space-y-3">
          <Link 
            href="/" 
            className="block w-full py-3 px-6 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
          >
            Kembali ke Beranda
          </Link>
          <Link 
            href="/forum" 
            className="block w-full py-3 px-6 bg-white text-gray-600 font-semibold rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            Baca Cerita Teman Lain
          </Link>
        </div>
      </div>
    </div>
  );
}