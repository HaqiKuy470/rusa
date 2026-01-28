'use server'

import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function sendMessage(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const consultationId = formData.get("consultationId") as string;
    const content = formData.get("content") as string;

    if (!content || !consultationId) return;

    // 1. Cek dulu siapa yang kirim pesan ini?
    const consultation = await prisma.consultation.findUnique({
        where: { id: consultationId },
        select: { studentId: true }
    });

    if (!consultation) return;

    // Logic: Jika ID pengirim == ID Siswa, maka isFromUser = true. 
    // Jika beda (berarti dia pengurus), maka isFromUser = false.
    const isStudent = user.id === consultation.studentId;

    try {
        await prisma.message.create({
            data: {
                content,
                consultationId,
                isFromUser: isStudent, // <--- Logic otomatis di sini
            }
        });

        // Update timestamp konsultasi biar naik ke atas list
        await prisma.consultation.update({
            where: { id: consultationId },
            data: { updatedAt: new Date() } // Update waktu agar muncul di paling atas
        });

        revalidatePath(`/konsultasi/${consultationId}`);
        revalidatePath(`/pengurus/konsultasi`);
    } catch (error) {
        console.error("Gagal kirim pesan:", error);
    }
}

// Action Tambahan: Tandai Selesai (Khusus Pengurus)
export async function closeConsultation(consultationId: string) {
    await prisma.consultation.update({
        where: { id: consultationId },
        data: { status: 'CLOSED' } // Pastikan di schema statusnya String atau Enum yang sesuai
    });
    revalidatePath(`/pengurus/konsultasi`);
}