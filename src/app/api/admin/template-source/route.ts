import { requireAdmin, apiError, HttpError } from '@/lib/admin';
import { readTemplate } from '@/lib/template-source';
export async function GET(request: Request) {
  try {
    const db = await requireAdmin(request);
    const filename = new URL(request.url).searchParams.get('filename');
    if (!filename) throw new HttpError(400, 'Select a template.');
    return Response.json({ html: await readTemplate(db, filename) }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) { return apiError(error); }
}
