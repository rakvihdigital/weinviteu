import { supabase } from '@/lib/supabase';
export async function GET(request: Request) {
  const { data } = await supabase.from('settings').select('whatsapp_number').eq('id', 1).single();
  const number = data?.whatsapp_number?.replace(/\D/g, '');
  if (!number) return Response.redirect(new URL('/contact', request.url));
  const title = new URL(request.url).searchParams.get('template');
  const url = new URL(`https://wa.me/${number}`);
  if (title) url.searchParams.set('text', `Hello, I would like to customize ${title.slice(0, 150)}.`);
  return Response.redirect(url);
}
