import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === '/admin/login') return NextResponse.next();
  const token = request.cookies.get('admin_access')?.value;
  if (token) {
    const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data: { user }, error } = await db.auth.getUser(token);
    if (!error && user?.app_metadata?.role === 'admin') return NextResponse.next();
  }
  return NextResponse.redirect(new URL('/admin/login', request.url));
}
export const config = { matcher: ['/admin/:path*'] };
