import { z } from 'zod';
import { supabase } from '@/lib/supabase';

const inquirySchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(200),
  email: z.string().trim().email('Valid email is required').max(320),
  phone: z.string().trim().max(50).optional(),
  category: z.string().trim().max(100).default('Wedding'),
  template_name: z.string().trim().max(200).optional(),
  message: z.string().trim().max(10000).default('')
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = inquirySchema.safeParse(json);
    if (!parsed.success) {
      return Response.json({ error: parsed.error.issues[0]?.message || 'Invalid input' }, { status: 400 });
    }

    const { name, email, phone, category, template_name, message } = parsed.data;

    // Try inserting into dedicated 'inquiries' table
    const { data, error } = await supabase
      .from('inquiries')
      .insert({
        client_name: name,
        email,
        phone: phone || null,
        category: category || 'Wedding',
        template_name: template_name || category || 'General Inquiry',
        message,
        status: 'New Inquiry'
      })
      .select('id')
      .maybeSingle();

    if (error) {
      // Graceful fallback to 'orders' table if migration has not been applied yet
      const fallback = await supabase
        .from('orders')
        .insert({
          client_name: name,
          email,
          template_name: template_name || category || 'General Inquiry',
          status: 'New Inquiry',
          price: '₹0',
          message: `[Category: ${category}] ${message}`.trim()
        })
        .select('id')
        .maybeSingle();

      if (fallback.error) {
        console.error('Inquiry submission error:', error, fallback.error);
        return Response.json({ error: 'Failed to record inquiry. Please reach out via WhatsApp.' }, { status: 500 });
      }

      return Response.json({ success: true, id: fallback.data?.id, fallback: true });
    }

    return Response.json({ success: true, id: data?.id });
  } catch (err: unknown) {
    console.error('Inquiry route error:', err);
    return Response.json({ error: 'Unexpected error occurred.' }, { status: 500 });
  }
}
