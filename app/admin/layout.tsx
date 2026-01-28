import React from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Users, 
  MessageSquareWarning, 
  FileText, 
  LogOut, 
  Settings,
  Hash, // Icon untuk Kategori Forum
  MessageCircle
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50 font-sans font-nunito">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 fixed h-full hidden md:block z-10">
        <div className="h-20 flex items-center px-6 border-b border-gray-100">
            {/* Logo RUSA */}
            <span className="text-2xl font-extrabold text-blue-600 tracking-tight">
                RUSA<span className="text-yellow-400">.</span>
            </span>
        </div>
        
        <nav className="p-4 space-y-1">
          <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 mt-4">Main Menu</p>
          
          <NavItem href="/admin" icon={<LayoutDashboard size={20} />} label="Dashboard" />
          <NavItem href="/admin/laporan" icon={<MessageSquareWarning size={20} />} label="Laporan Bullying" />
          <NavItem href="/admin/konsultasi" icon={<MessageCircle size={20} />} label="Pantau Konsultasi" />
          
          <NavItem href="/admin/kategori" icon={<Hash size={20} />} label="Kelola Forum" />
          
          <NavItem href="/admin/users" icon={<Users size={20} />} label="Data Pengguna" />
          
          <div className="pt-8 pb-2">
            <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">System</p>
          </div>
          <NavItem href="/admin/settings" icon={<Settings size={20} />} label="Pengaturan" />
          <form action="/auth/signout" method="post">
            <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-600 rounded-lg hover:bg-red-50 transition-colors mt-2 text-left">
                <LogOut size={20} />
                Keluar
            </button>
          </form>
        </nav>
      </aside>

      {/* Main Content Wrapper */}
      <main className="flex-1 md:ml-64 p-8">
        {children}
      </main>
    </div>
  );
}

// Komponen Helper untuk Navigasi
function NavItem({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link 
      href={href} 
      className="flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-lg text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
    >
      {icon}
      {label}
    </Link>
  );
}