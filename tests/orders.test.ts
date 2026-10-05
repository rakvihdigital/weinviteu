// @vitest-environment node
import { beforeEach, it, expect, vi } from 'vitest';
const mocks = vi.hoisted(() => ({ admin: vi.fn(), from: vi.fn(), upload: vi.fn(), remove: vi.fn(), update: vi.fn(), insert: vi.fn(), lookup: vi.fn(), template: vi.fn() }));
vi.mock('@/lib/admin', async () => ({ ...await vi.importActual<typeof import('../src/lib/admin')>('../src/lib/admin'), requireAdmin: mocks.admin }));
vi.mock('@/lib/template-source', () => ({ readTemplate: vi.fn().mockResolvedValue('<body><h1>Original</h1></body>') }));
import { POST } from '../src/app/api/admin/orders/route';
import { readTemplate } from '../src/lib/template-source';
import { emptyEditor } from '../src/lib/models';
const id = '5bc55f29-7c46-42b2-89d9-f37c0c46cd26';
const request = () => new Request('https://site.test/api/admin/orders', { method: 'POST', body: JSON.stringify({ id, client_name: 'Client', email: 'client@example.com', template_filename: 'test.html', editor_state: { ...emptyEditor(), texts: { 'body.0.0': 'Saved name' } } }) });
beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(readTemplate).mockResolvedValue('<body><h1>Original</h1></body>');
  const orders = { select: vi.fn().mockReturnThis(), eq: vi.fn().mockReturnThis(), maybeSingle: mocks.lookup, update: mocks.update, insert: mocks.insert };
  const templates = { select: vi.fn().mockReturnThis(), eq: vi.fn().mockReturnThis(), maybeSingle: mocks.template };
  mocks.from.mockImplementation(table => table === 'orders' ? orders : templates);
  mocks.lookup.mockResolvedValue({ data: { id, template_filename: 'test.html', source_html: '<body><h1>Original</h1></body>', published_file: 'previous.html' } });
  mocks.template.mockResolvedValue({ data: { title: 'Template' } });
  mocks.update.mockReturnValue({ eq: vi.fn().mockResolvedValue({ error: null }) }); mocks.insert.mockResolvedValue({ error: null }); mocks.upload.mockResolvedValue({ error: null }); mocks.remove.mockResolvedValue({ error: null });
  mocks.admin.mockResolvedValue({ from: mocks.from, storage: { from: () => ({ upload: mocks.upload, remove: mocks.remove }) } });
});
it('keeps the order ID and persists editable source and customization', async () => {
  const response = await POST(request());
  expect(response.status).toBe(200);
  expect(mocks.update).toHaveBeenCalledWith(expect.objectContaining({ id, status: 'Customizing', source_html: '<body><h1>Original</h1></body>', editor_state: expect.objectContaining({ texts: { 'body.0.0': 'Saved name' } }) }));
  expect(mocks.upload.mock.calls[0][1]).toContain('Saved name');
  expect(mocks.remove).toHaveBeenCalledWith(['previous.html']);
});
it('retains the old published invitation when database saving fails', async () => {
  mocks.update.mockReturnValue({ eq: vi.fn().mockResolvedValue({ error: new Error('database failure') }) });
  vi.spyOn(console, 'error').mockImplementation(() => {});
  expect((await POST(request())).status).toBe(500);
  expect(mocks.remove).toHaveBeenCalledWith([mocks.upload.mock.calls[0][0]]);
  expect(mocks.remove).not.toHaveBeenCalledWith(['previous.html']);
  vi.restoreAllMocks();
});
it('does not change the order if uploading fails', async () => {
  mocks.upload.mockResolvedValue({ error: new Error('upload failure') });
  vi.spyOn(console, 'error').mockImplementation(() => {});
  expect((await POST(request())).status).toBe(500);
  expect(mocks.update).not.toHaveBeenCalled(); expect(mocks.remove).not.toHaveBeenCalled();
  vi.restoreAllMocks();
});
it('allows editing a saved draft after its template was removed from the library', async () => {
  mocks.lookup.mockResolvedValue({ data: { id, template_filename: 'test.html', template_name: 'Archived', source_html: '<body><h1>Original</h1></body>' } });
  mocks.template.mockResolvedValue({ data: null });
  expect((await POST(request())).status).toBe(200);
  expect(mocks.update.mock.calls[0][0].template_name).toBe('Archived');
});

it('creates a new draft once when the order does not exist', async () => {
  mocks.lookup.mockResolvedValue({ data: null });
  expect((await POST(request())).status).toBe(200);
  expect(mocks.insert).toHaveBeenCalledWith(expect.objectContaining({ id }));
  expect(mocks.update).not.toHaveBeenCalled();
});
