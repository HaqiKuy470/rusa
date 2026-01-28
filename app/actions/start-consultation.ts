'use server'

import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function startConsultation(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return redirect("/login");

  const topic = formData.get("topic") as string;
  const firstMessage = formData.get("message") as string;

  if (!topic || !firstMessage) return;

  // 1. Buat Room Konsultasi Baru
  const newConsultation = await prisma.consultation.create({
    data: {
      topic,
      studentId: user.id,
      status: 'OPEN',
      // 2. Sekalian simpan pesan pertamanya
      messages: {
        create: {
          content: firstMessage,
          isFromUser: true,
        }
      }
    }
  });

  revalidatePath('/konsultasi');
  // Redirect ke halaman detail chat (nanti kita buat di step selanjutnya)
  redirect(`/konsultasi/${newConsultation.id}`);
}