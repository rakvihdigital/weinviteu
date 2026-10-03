import { readFile } from 'node:fs/promises';
import path from 'node:path';
import type { SupabaseClient } from '@supabase/supabase-js';
import { HttpError } from './admin';
export async function readTemplate(db: SupabaseClient, filename: string) {
  const { data, error } = await db.from('templates').select('filename').eq('filename', filename).single();
  if (error || !data) throw new HttpError(404, 'Template not found.');
  if (filename.startsWith('http')) {
    const url = new URL(filename);
    const expected = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL!);
    if (url.origin !== expected.origin || !url.pathname.startsWith('/storage/v1/object/public/base-templates/')) throw new HttpError(400, 'Invalid template location.');
    const { data: file, error: downloadError } = await db.storage.from('base-templates').download(decodeURIComponent(url.pathname.split('/').pop()!));
    if (downloadError || !file) throw new HttpError(404, 'Template file not found.');
    return file.text();
  }
  if (path.basename(filename) !== filename || !filename.endsWith('.html')) throw new HttpError(400, 'Invalid template filename.');
  return readFile(path.join(process.cwd(), 'public/templates', filename), 'utf8');
}
