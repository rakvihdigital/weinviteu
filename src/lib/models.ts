export interface Template { id: number; title: string; filename: string; category: string; badge: string; bg?: string; enabled: boolean }
export interface EditorState { texts: Record<string, string>; images: Record<string, string>; primaryColor: string; bgColor: string; musicUrl: string }
export const emptyEditor = (): EditorState => ({ texts: {}, images: {}, primaryColor: '', bgColor: '', musicUrl: '' });
export interface Order { id: string; client_name: string; email: string; template_name: string; template_filename?: string; status: string; price: string; message?: string; created_at: string; editor_state?: EditorState; source_html?: string; published_file?: string; }
export function templateUrl(filename: string) {
  if (filename.startsWith('http')) return `/api/serve-template/${encodeURIComponent(new URL(filename).pathname.split('/').pop()!)}`;
  return `/templates/${encodeURIComponent(filename)}`;
}
