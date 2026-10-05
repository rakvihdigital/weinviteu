/**
 * Resolve a template filename (which may be a full Supabase URL) to a local
 * preview URL that the browser can load.
 */
export function getTemplateUrl(filename: string) {
  if (filename.startsWith('http')) {
    // Extract just the filename from the full Supabase URL and proxy through our API
    const parts = filename.split('/');
    const file = parts[parts.length - 1];
    return `/api/serve-template/${encodeURIComponent(file)}`;
  }
  return `/templates/${encodeURIComponent(filename)}`;
}
