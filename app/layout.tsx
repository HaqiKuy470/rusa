import type { Metadata } from "next";
import { Nunito } from "next/font/google"; // Font bulat ramah anak
import "./globals.css";


const nunito = Nunito({ 
  subsets: ["latin"],
  weight: ['400', '600', '700', '800'],
  variable: '--font-nunito',
});

export const metadata: Metadata = {
  title: "RUSA - Ruang Suara Anak",
  description: "Platform aman untuk anak berekspresi dan berkarya.",
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${nunito.className} antialiased bg-sky-50 text-slate-800`}>
        {children}
      </body>
    </html>
  );
}