import { z } from 'zod';
import { requireAdmin, apiError, HttpError } from '@/lib/admin';
function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]!);
}
export async function POST(request: Request) {
  try {
    const db = await requireAdmin(request);
    const parsed = z.object({ orderId: z.uuid() }).safeParse(await request.json());
    if (!parsed.success) throw new HttpError(400, 'Invalid order ID.');
    const { data: order, error } = await db.from('orders').select('id,email,client_name,published_file,status').eq('id', parsed.data.orderId).single();
    if (error || !order?.published_file) throw new HttpError(400, 'Save this invitation before sending it.');
    if (!z.email().safeParse(order.email).success) throw new HttpError(400, 'A valid client email is required.');
    if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM || !process.env.SITE_URL) throw new HttpError(503, 'Invitation saved. Email delivery is not configured; copy the invitation link to share it.');
    const inviteUrl = new URL(`/invite/${order.id}`, process.env.SITE_URL).href;
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json', 'Idempotency-Key': `invite-${order.published_file}` },
      body: JSON.stringify({ from: process.env.EMAIL_FROM, to: [order.email], subject: 'Your custom invitation is ready', html: `<div style="font-family:Arial,sans-serif;color:#222"><h1>Hello, ${escapeHtml(order.client_name)}!</h1><p>Your invitation is ready to share with your guests.</p><a href="${escapeHtml(inviteUrl)}">View your invitation</a></div>` }),
    });
    if (!response.ok) throw new HttpError(502, 'Invitation saved, but the email provider could not send it. Please retry.');
    const { error: updateError } = await db.from('orders').update({ status: 'Link Delivered' }).eq('id', order.id).eq('published_file', order.published_file);
    if (updateError) throw new HttpError(500, 'Email accepted by the provider, but the order status could not be updated.');
    return Response.json({ success: true });
  } catch (error) { return apiError(error); }
}
