import Navbar from "@/components/Navbar";
import { getForumCategories, getRecentDiscussions } from "@/lib/actions";
import Link from "next/link";
import { MessageCircle, Hash, Clock, ArrowRight } from "lucide-react";
import * as Icons from "lucide-react"; // Import dinamis untuk icon kategori

export const revalidate = 0; // Selalu ambil data terbaru

export default async function ForumPage() {
  const categories = await getForumCategories();
  const recentPosts = await getRecentDiscussions();

  return (
    <main className="min-h-screen bg-slate-50 font-nunito">
      <Navbar />
      
      {/* HEADER FORUM */}
      <div className="bg-indigo-600 pt-32 pb-20 px-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10">
            <Icons.MessageCircle size={400} />
        </div>
        <div className="max-w-6xl mx-auto relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Forum Sahabat RUSA 💬</h1>
          <p className="text-indigo-100 text-lg max-w-2xl mx-auto">
            Temukan teman baru, diskusikan hobimu, dan saling dukung. 
            Ingat jaga sopan santun ya!
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-10 pb-20">
        
        {/* LIST KATEGORI (GRID CARD) */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {categories.map((cat) => {
            // Teknik render icon dinamis dari string database
            // @ts-ignore
            const IconComponent = Icons[cat.icon] || Icons.Hash; 
            
            return (
              <Link 
                href={`/forum/kategori/${cat.slug}`} 
                key={cat.id}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border border-slate-100 group"
              >
                <div className={`w-12 h-12 ${cat.color} rounded-xl flex items-center justify-center text-white mb-4 shadow-md group-hover:scale-110 transition-transform`}>
                  <IconComponent size={24} />
                </div>
                <h3 className="font-bold text-lg text-slate-800 mb-1">{cat.name}</h3>
                <p className="text-sm text-slate-500 leading-snug">{cat.description}</p>
              </Link>
            )
          })}
        </div>

        {/* DISKUSI TERBARU */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Clock className="text-blue-500" /> Diskusi Baru Saja
            </h2>
            <Link href="/forum/buat-topik" className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-colors">
              + Buat Topik Baru
            </Link>
          </div>

          <div className="space-y-4">
            {recentPosts.length > 0 ? (
              recentPosts.map((post) => (
                <div key={post.id} className="flex flex-col md:flex-row gap-4 p-4 hover:bg-slate-50 rounded-2xl border border-slate-100 transition-colors">
                  {/* Avatar User */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-500">
                      {post.author.fullName.charAt(0)}
                    </div>
                  </div>
                  
                  <div className="flex-grow">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold text-white ${post.category.color}`}>
                        {post.category.name}
                      </span>
                      <span className="text-xs text-slate-400">
                        {new Date(post.createdAt).toLocaleDateString('id-ID')}
                      </span>
                    </div>
                    <Link href={`/forum/post/${post.id}`}>
                      <h3 className="font-bold text-slate-800 hover:text-blue-600 text-lg mb-1 cursor-pointer">
                        {post.title}
                      </h3>
                    </Link>
                    <p className="text-slate-500 text-sm line-clamp-2">{post.content}</p>
                  </div>

                  <div className="flex items-center gap-4 text-slate-400 text-sm font-semibold whitespace-nowrap md:self-center">
                     <div className="flex items-center gap-1">
                        <MessageCircle size={16} /> {post._count.comments}
                     </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-slate-400">
                <p>Belum ada diskusi nih. Jadilah yang pertama!</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </main>
  );
}