// FILE: app/(main)/layout.tsx
import Navbar from "@/components/Navbar"; // Sesuaikan path import Navbar kamu

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar hanya muncul di grup (main) */}
      <Navbar /> 
      
      <main className="flex-grow">
        {children}
      </main>
    </div>
  );
}