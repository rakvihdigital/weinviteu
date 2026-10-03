import { supabase } from '@/lib/supabase';
export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) return new Response('Invitation not found', { status: 404 });
  // The database function exposes only a published storage filename for this unguessable ID.
  const { data: filename, error } = await supabase.rpc('invitation_file', { invitation_id: id });
  if (error || !filename) return new Response('Invitation not found', { status: 404 });
  const { data: file, error: downloadError } = await supabase.storage.from('custom-templates').download(filename);
  if (downloadError || !file) return new Response('Invitation not found', { status: 404 });
  return new Response(await file.text(), { headers: {
    'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store',
    'Content-Security-Policy': "sandbox allow-scripts allow-forms allow-popups allow-modals; base-uri 'none'",
    'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'no-referrer',
  } });
}
