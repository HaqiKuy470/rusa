import { PrismaClient } from "@prisma/client";

// Mencegah multiple instance saat hot-reload di Next.js
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
    globalForPrisma.prisma ||
    new PrismaClient({
        // Opsional: Aktifkan log query jika ingin melihat SQL di terminal
        // log: ["query"], 
    });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;