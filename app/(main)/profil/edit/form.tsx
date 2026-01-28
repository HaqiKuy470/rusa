'use client'

import { updateProfile } from "@/app/actions/update-profile";
import { useState } from "react";
import Image from "next/image";
import { Save, User } from "lucide-react";

// Koleksi Karakter Lucu (Menggunakan DiceBear API)
const AVATAR_OPTIONS = [
    "https://api.dicebear.com/9.x/adventurer/svg?seed=Felix",
    "https://api.dicebear.com/9.x/adventurer/svg?seed=Aneka",
    "https://api.dicebear.com/9.x/adventurer/svg?seed=Zoe",
    "https://api.dicebear.com/9.x/adventurer/svg?seed=Jack",
    "https://api.dicebear.com/9.x/adventurer/svg?seed=Abby",
    "https://api.dicebear.com/9.x/fun-emoji/svg?seed=Leo",
    "https://api.dicebear.com/9.x/fun-emoji/svg?seed=Mimi",
    "https://api.dicebear.com/9.x/bottts/svg?seed=Robo", // Robot lucu
];

export default function EditProfileForm({ user }: { user: any }) {
    const [selectedAvatar, setSelectedAvatar] = useState(user?.avatarUrl || AVATAR_OPTIONS[0]);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (formData: FormData) => {
        setLoading(true);
        // Masukkan avatar yang dipilih ke dalam formData
        formData.append("avatarUrl", selectedAvatar);
        await updateProfile(formData);
    };

    return (
        <form action={handleSubmit} className="space-y-8">

            {/* BAGIAN 1: Input Nama */}
            <div className="space-y-3">
                <label className="block text-sm font-bold text-gray-700">Nama Panggilan / Samaran</label>
                <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        name="fullName"
                        defaultValue={user?.fullName}
                        required
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all bg-gray-50 font-medium"
                        placeholder="Contoh: Kapten RUSA"
                    />
                </div>
                <p className="text-xs text-gray-400">Gunakan nama yang keren, tapi sopan ya!</p>
            </div>

            {/* BAGIAN 2: Pilih Karakter (Avatar Grid) */}
            <div className="space-y-3">
                <label className="block text-sm font-bold text-gray-700">Pilih Karaktermu</label>

                <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-3">
                    {AVATAR_OPTIONS.map((url, index) => (
                        <button
                            key={index}
                            type="button"
                            onClick={() => setSelectedAvatar(url)}
                            className={`relative aspect-square rounded-xl overflow-hidden transition-all ${selectedAvatar === url
                                    ? "ring-4 ring-blue-500 scale-110 shadow-lg z-10 bg-blue-50"
                                    : "hover:bg-gray-100 border border-transparent hover:border-gray-200"
                                }`}
                        >
                            <Image
                                src={url}
                                alt="Avatar"
                                fill
                                className="object-cover p-1"
                                unoptimized
                            />
                            {/* Tanda Centang jika dipilih */}
                            {selectedAvatar === url && (
                                <div className="absolute inset-0 bg-blue-500/10 flex items-center justify-center">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* BAGIAN 3: Preview & Submit */}
            <div className="flex items-center gap-4 bg-blue-50 p-4 rounded-xl border border-blue-100">
                <div className="w-12 h-12 bg-white rounded-full border border-blue-200 overflow-hidden relative shrink-0">
                    <Image
                        src={selectedAvatar}
                        alt="Preview"
                        fill
                        className="object-cover"
                        unoptimized // <--- TAMBAHKAN INI JUGA
                    />
                </div>
                <div className="flex-1">
                    <p className="text-sm font-bold text-blue-900">Siap mengubah profil?</p>
                    <p className="text-xs text-blue-600">Pastikan pilihanmu sudah sesuai.</p>
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-bold shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {loading ? "Menyimpan..." : (
                        <>
                            <Save size={18} />
                            Simpan
                        </>
                    )}
                </button>
            </div>

        </form>
    );
}