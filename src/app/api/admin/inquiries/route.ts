import { z } from 'zod';
import { requireAdmin, apiError, HttpError } from '@/lib/admin';

export async function GET(request: Request) {
  try {
    const db = await requireAdmin(request);
    const id = new URL(request.url).searchParams.get('id');

    if (id) {
      if (!z.uuid().safeParse(id).success) throw new HttpError(400, 'Invalid inquiry ID.');
      
      const { data, error } = await db.from('inquiries').select('*').eq('id', id).maybeSingle();
      if (!error && data) {
        return Response.json(data, { headers: { 'Cache-Control': 'no-store' } });
      }

      // Fallback to orders table if not in inquiries
      const fallback = await db.from('orders').select('*').eq('id', id).maybeSingle();
      if (fallback.data) {
        return Response.json({
          id: fallback.data.id,
          client_name: fallback.data.client_name,
          email: fallback.data.email,
          category: 'Wedding',
          template_name: fallback.data.template_name || '',
          message: fallback.data.message || '',
          status: fallback.data.status,
          created_at: fallback.data.created_at
        }, { headers: { 'Cache-Control': 'no-store' } });
      }

      throw new HttpError(404, 'Inquiry not found.');
    }

    // Attempt to query inquiries table
    const { data: inqData, error: inqError } = await db
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (!inqError && inqData && inqData.length > 0) {
      return Response.json(inqData, { headers: { 'Cache-Control': 'no-store' } });
    }

    // Fallback: check orders table for un-migrated leads
    const { data: orderData, error: orderError } = await db
      .from('orders')
      .select('id,client_name,email,template_name,status,message,created_at,published_file')
      .order('created_at', { ascending: false });

    if (orderError && inqError) throw inqError;

    const leads = (orderData || [])
      .filter((o) => !o.published_file || o.status === 'New Inquiry' || o.status === 'Contacted')
      .map((o) => ({
        id: o.id,
        client_name: o.client_name,
        email: o.email,
        phone: null,
        category: o.template_name?.toLowerCase().includes('birthday')
          ? 'Birthday'
          : o.template_name?.toLowerCase().includes('anniversary')
          ? 'Anniversary'
          : 'Wedding',
        template_name: o.template_name || '',
        message: o.message || '',
        status: o.status,
        created_at: o.created_at
      }));

    return Response.json(inqData && inqData.length > 0 ? inqData : leads, {
      headers: { 'Cache-Control': 'no-store' }
    });
  } catch (error) {
    return apiError(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const db = await requireAdmin(request);
    const schema = z.object({
      id: z.uuid(),
      status: z.enum(['New Inquiry', 'Contacted', 'Converted', 'Archived']).optional(),
      category: z.string().min(1).max(100).optional(),
      template_name: z.string().max(200).optional()
    });

    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) throw new HttpError(400, 'Invalid inquiry update payload.');

    const { id, ...updates } = parsed.data;

    // Try updating inquiries table
    const { data, error } = await db
      .from('inquiries')
      .update(updates)
      .eq('id', id)
      .select('id')
      .maybeSingle();

    if (!error && data) {
      return Response.json({ success: true, updated: 'inquiries' });
    }

    // Fallback: update orders table
    const orderUpdates: Record<string, string> = {};
    if (updates.status) orderUpdates.status = updates.status;
    if (updates.template_name) orderUpdates.template_name = updates.template_name;

    if (Object.keys(orderUpdates).length > 0) {
      await db.from('orders').update(orderUpdates).eq('id', id);
    }

    return Response.json({ success: true, updated: 'orders' });
  } catch (error) {
    return apiError(error);
  }
}

export async function DELETE(request: Request) {
  try {
    const db = await requireAdmin(request);
    const id = new URL(request.url).searchParams.get('id');
    if (!id || !z.uuid().safeParse(id).success) {
      throw new HttpError(400, 'Invalid inquiry ID.');
    }

    await db.from('inquiries').delete().eq('id', id);
    await db.from('orders').delete().eq('id', id).eq('published_file', null);

    return Response.json({ success: true });
  } catch (error) {
    return apiError(error);
  }
}
