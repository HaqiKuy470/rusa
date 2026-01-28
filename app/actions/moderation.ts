'use server'

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// 1. Action untuk Update Status Laporan
export async function updateReportStatus(reportId: string, newStatus: 'APPROVED' | 'REJECTED') {
  try {
    await prisma.report.update({
      where: { id: reportId },
      data: { status: newStatus }
    });
    revalidatePath('/pengurus/laporan'); // Refresh halaman laporan
    revalidatePath('/pengurus');         // Refresh dashboard utama
  } catch (error) {
    console.error("Gagal update laporan:", error);
  }
}

// 2. Action untuk Update Status Karya
export async function updateArtworkStatus(artworkId: string, newStatus: 'APPROVED' | 'REJECTED') {
  try {
    await prisma.artwork.update({
      where: { id: artworkId },
      data: { status: newStatus }
    });
    revalidatePath('/pengurus/karya');   // Refresh halaman karya
    revalidatePath('/galeri');           // Refresh galeri publik
    revalidatePath('/pengurus');         // Refresh dashboard utama
  } catch (error) {
    console.error("Gagal update karya:", error);
  }
}