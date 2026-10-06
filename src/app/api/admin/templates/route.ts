import { z } from 'zod';
import { requireAdmin, apiError, HttpError } from '@/lib/admin';
import { templateSchema } from '@/lib/schemas';
import { analyzeTemplate } from '@/lib/template-analyzer';
export async function GET(request: Request) {
  try {
    const db = await requireAdmin(request);
    const { data, error } = await db.from('templates').select('*').order('id');
    if (error) throw error;
    return Response.json(data, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) { return apiError(error); }
}
export async function POST(request: Request) {
  try {
    const db = await requireAdmin(request);
    const form = await request.formData();
    const input = templateSchema.safeParse(Object.fromEntries(['title', 'category', 'badge', 'price', 'original_price'].map(key => [key, form.get(key)]).filter(([, v]) => v !== null)));
    const file = form.get('file');
    if (!input.success || !(file instanceof File) || !file.name.endsWith('.html') || file.size > 10 * 1024 * 1024) throw new HttpError(400, 'Choose an HTML file under 10 MB and fill in the template details.');
    const html = await file.text();
    const report = analyzeTemplate(html);
    // Block upload if there's a critical failure (canvas text rendering)
    const critical = report.items.filter(i => i.status === 'fail' && i.key !== 'text');
    if (critical.length > 0 && form.get('force') !== 'true') {
      return Response.json({ success: false, report, requiresConfirmation: true }, { status: 422 });
    }
    const filename = `${crypto.randomUUID()}.html`;
    const blob = new Blob([html], { type: 'text/html' });
    const { error: uploadError } = await db.storage.from('base-templates').upload(filename, blob, { contentType: 'text/html' });
    if (uploadError) throw uploadError;
    const { data: { publicUrl } } = db.storage.from('base-templates').getPublicUrl(filename);
    const { data: catData } = await db.from('categories').select('id').ilike('name', input.data.category).maybeSingle();
    const payload = { ...input.data, filename: publicUrl, category_id: catData?.id || null };
    const { error } = await db.from('templates').insert(payload);
    if (error) { await db.storage.from('base-templates').remove([filename]); throw error; }
    return Response.json({ success: true, report });
  } catch (error) { return apiError(error); }
}
export async function PATCH(request: Request) {
  try {
    const db = await requireAdmin(request);
    const input = templateSchema.partial().extend({ id: z.number().int().positive() }).safeParse(await request.json());
    if (!input.success) throw new HttpError(400, 'Invalid template details.');
    const { id, ...changes } = input.data;
    const updatePayload: Record<string, unknown> = { ...changes };
    if (changes.category) {
      const { data: catData } = await db.from('categories').select('id').ilike('name', changes.category).maybeSingle();
      if (catData?.id) updatePayload.category_id = catData.id;
    }
    const { error } = await db.from('templates').update(updatePayload).eq('id', id).select('id').single();
    if (error) throw error;
    return Response.json({ success: true });
  } catch (error) { return apiError(error); }
}
export async function DELETE(request: Request) {
  try {
    const db = await requireAdmin(request);
    const input = z.object({ id: z.number().int().positive() }).safeParse(await request.json());
    if (!input.success) throw new HttpError(400, 'Invalid template ID.');
    const { error } = await db.from('templates').delete().eq('id', input.data.id).select('id').single();
    if (error) throw error;
    return Response.json({ success: true });
  } catch (error) { return apiError(error); }
}
