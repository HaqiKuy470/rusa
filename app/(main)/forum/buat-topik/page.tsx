import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import TopicForm from "./TopicForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function BuatTopikPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Ambil Kategori untuk Dropdown
  const categories = await prisma.forumCategory.findMany();

  return (
    <div className="min-h-screen bg-[#FDFBF7] pt-28 pb-10 px-4 font-nunito flex justify-center">
      <div className="max-w-2xl w-full">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
            <Link href="/forum" className="p-2 bg-white rounded-full border border-slate-200 hover:bg-slate-100 transition-colors">
                <ArrowLeft size={20} className="text-slate-600" />
            </Link>
            <div>
                <h1 className="text-2xl font-extrabold text-slate-900">Buat Topik Baru 📢</h1>
                <p className="text-slate-500 text-sm">Ayo mulai diskusi seru dengan teman-teman!</p>
            </div>
        </div>

        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200">
            {categories.length > 0 ? (
                <TopicForm categories={categories} />
            ) : (
                <div className="text-center py-10">
                    <p className="text-red-500 font-bold mb-2">Belum ada Kategori!</p>
                    <p className="text-sm text-slate-500">
                        Admin perlu membuat kategori forum terlebih dahulu di database.
                    </p>
                </div>
            )}
        </div>

      </div>
    </div>
  );
}