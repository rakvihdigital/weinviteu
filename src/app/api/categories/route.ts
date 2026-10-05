import { supabase } from '@/lib/supabase';
import type { Category } from '@/lib/models';

export const fallbackCategories: Category[] = [
  { id: 1, name: 'Wedding', slug: 'wedding', badge: 'WEDDING', display_order: 1, is_active: true },
  { id: 2, name: 'Birthday', slug: 'birthday', badge: 'BIRTHDAY', display_order: 2, is_active: true },
  { id: 3, name: 'Baby Shower', slug: 'baby-shower', badge: 'BABY SHOWER', display_order: 3, is_active: true },
  { id: 4, name: 'Traditional', slug: 'traditional', badge: 'TRADITIONAL', display_order: 4, is_active: true },
  { id: 5, name: 'Corporate', slug: 'corporate', badge: 'CORPORATE', display_order: 5, is_active: true },
  { id: 6, name: 'Anniversary', slug: 'anniversary', badge: 'ANNIVERSARY', display_order: 6, is_active: true },
];

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return Response.json(fallbackCategories);
    }
    return Response.json(data);
  } catch {
    return Response.json(fallbackCategories);
  }
}
