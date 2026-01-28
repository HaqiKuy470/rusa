import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import EditProfileForm from "./form"; // Kita pisahkan form-nya agar rapi

export default async function EditProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Ambil data user saat ini untuk ditampilkan di form
  const currentUser = await prisma.profile.findUnique({
    where: { id: user.id },
  });

  return (
    <div className="min-h-screen bg-[#FDFBF7] pt-28 pb-10 px-4 flex justify-center">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Ubah Tampilanmu 🎨</h1>
          <p className="text-gray-500 mb-8">
            Pilih karakter yang paling menggambarkan dirimu!
          </p>

          {/* Load Form Client Component */}
          <EditProfileForm user={currentUser} />
        </div>
      </div>
    </div>
  );
}