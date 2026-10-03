import { supabase } from '@/lib/supabase';
export async function GET(_request: Request, context: { params: Promise<{ filename: string }> }) {
  const { filename } = await context.params;
  if (!/^[\w .()-]+\.html$/.test(filename)) return new Response('Template not found', { status: 404 });
  const { data, error } = await supabase.storage.from('base-templates').download(filename);
  if (error || !data) return new Response('Template not found', { status: 404 });
  return new Response(await data.text(), { headers: {
    'Content-Type': 'text/html; charset=utf-8',
    'Content-Security-Policy': "sandbox allow-scripts allow-forms allow-popups allow-modals; base-uri 'none'",
    'X-Content-Type-Options': 'nosniff',
  } });
}
