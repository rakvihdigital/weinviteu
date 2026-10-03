import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

export function authClient(token?: string) {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
    ...(token ? { global: { headers: { Authorization: `Bearer ${token}` } } } : {}),
  });
}

export class HttpError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

export async function requireAdmin(request?: Request) {
  if (request && !['GET', 'HEAD'].includes(request.method)) {
    const origin = request.headers.get('origin');
    if (request.headers.get('sec-fetch-site') === 'cross-site' || (origin && origin !== new URL(request.url).origin)) {
      throw new HttpError(403, 'Request origin is not allowed.');
    }
  }
  const token = (await cookies()).get('admin_access')?.value;
  if (!token) throw new HttpError(401, 'Please sign in again.');
  const db = authClient(token);
  const { data: { user }, error } = await db.auth.getUser(token);
  if (error || !user) throw new HttpError(401, 'Your session expired. Please sign in again.');
  if (user.app_metadata?.role !== 'admin') throw new HttpError(403, 'Administrator access required.');
  return db;
}

export function apiError(error: unknown) {
  if (error instanceof HttpError) return Response.json({ error: error.message }, { status: error.status });
  console.error(error);
  return Response.json({ error: 'The operation failed. Check database setup and try again.' }, { status: 500 });
}
