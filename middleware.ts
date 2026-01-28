import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // 1. Cek User Session
  const { data: { user } } = await supabase.auth.getUser();

  // 2. Proteksi Halaman Admin
  // Sesuai blueprint: Admin & Pengurus yang boleh masuk [cite: 15, 19]
  if (request.nextUrl.pathname.startsWith("/admin")) {
    if (!user) {
      // Kalau belum login, lempar ke halaman login
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
    
    // Opsi: Cek Role (Jika tabel profiles sudah ada kolom 'role')
    // const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    // if (profile?.role !== 'admin' && profile?.role !== 'pengurus') {
    //    return NextResponse.redirect(new URL("/", request.url));
    // }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};