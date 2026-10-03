import { z } from 'zod';
import { requireAdmin, apiError, HttpError } from '@/lib/admin';
import { templateSchema } from '@/lib/schemas';
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
    const input = templateSchema.safeParse(Object.fromEntries(['title', 'category', 'badge'].map(key => [key, form.get(key)])));
    const file = form.get('file');
    if (!input.success || !(file instanceof File) || !file.name.endsWith('.html') || file.size > 10 * 1024 * 1024) throw new HttpError(400, 'Choose an HTML file under 10 MB and fill in the template details.');
    const filename = `${crypto.randomUUID()}.html`;
    const { error: uploadError } = await db.storage.from('base-templates').upload(filename, file, { contentType: 'text/html' });
    if (uploadError) throw uploadError;
    const { data: { publicUrl } } = db.storage.from('base-templates').getPublicUrl(filename);
    const { error } = await db.from('templates').insert({ ...input.data, filename: publicUrl });
    if (error) { await db.storage.from('base-templates').remove([filename]); throw error; }
    return Response.json({ success: true });
  } catch (error) { return apiError(error); }
}
export async function PATCH(request: Request) {
  try {
    const db = await requireAdmin(request);
    const input = templateSchema.partial().extend({ id: z.number().int().positive() }).safeParse(await request.json());
    if (!input.success) throw new HttpError(400, 'Invalid template details.');
    const { id, ...changes } = input.data;
    const { error } = await db.from('templates').update(changes).eq('id', id).select('id').single();
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
