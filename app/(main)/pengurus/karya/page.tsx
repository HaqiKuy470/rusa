import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";
import { updateArtworkStatus } from "@/app/actions/moderation";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Check, X, Palette, User } from "lucide-react";

export default async function ModerasiKaryaPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Cek Role
  const viewer = await prisma.profile.findUnique({ where: { id: user.id } });
  if (viewer?.role === 'ANAK') redirect("/dashboard");

  // Ambil Karya (Hanya yang PENDING)
  const pendingArtworks = await prisma.artwork.findMany({
    where: { status: 'PENDING' },
    orderBy: { createdAt: 'desc' },
    include: { author: true }
  });

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-10 px-4 font-nunito">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/pengurus" className="p-2 bg-white rounded-full border border-slate-200 hover:bg-slate-100 transition-colors">
            <ArrowLeft size={20} className="text-slate-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Moderasi Galeri 🎨</h1>
            <p className="text-slate-500 text-sm">Setujui karya yang layak tampil di Galeri Sekolah.</p>
          </div>
        </div>

        {pendingArtworks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 bg-white rounded-3xl border border-slate-200 border-dashed">
            <Palette size={64} className="mb-4 opacity-50" />
            <p className="text-lg font-medium">Semua karya sudah dimoderasi!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {pendingArtworks.map((art) => (
              <ArtworkCard key={art.id} art={art} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

function ArtworkCard({ art }: { art: any }) {
  const approveAction = updateArtworkStatus.bind(null, art.id, 'APPROVED');
  const rejectAction = updateArtworkStatus.bind(null, art.id, 'REJECTED');

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 flex flex-col group hover:shadow-md transition-shadow">
      {/* Image Preview */}
      <div className="relative aspect-square bg-slate-100">
        <Image 
          src={art.imageUrl} 
          alt={art.title}
          fill
          className="object-cover"
          unoptimized // Penting buat Supabase Image
        />
        {/* Overlay Info */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
          <p className="text-white text-xs line-clamp-2">{art.description}</p>
        </div>
      </div>

      {/* Info & Actions */}
      <div className="p-4 flex flex-col gap-4 flex-1">
        <div className="flex-1">
          <h3 className="font-bold text-slate-900 line-clamp-1" title={art.title}>{art.title}</h3>
          <div className="flex items-center gap-2 mt-1 text-slate-500 text-xs font-medium">
            <User size={12} />
            <span>{art.author.fullName}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <form action={rejectAction}>
            <button className="w-full py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-sm font-bold flex items-center justify-center gap-1 transition-colors">
              <X size={16} /> Tolak
            </button>
          </form>
          <form action={approveAction}>
            <button className="w-full py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg text-sm font-bold flex items-center justify-center gap-1 transition-colors shadow-sm">
              <Check size={16} /> Terima
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}