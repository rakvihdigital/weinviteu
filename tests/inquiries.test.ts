// @vitest-environment node
import { beforeEach, it, expect, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  admin: vi.fn(),
  from: vi.fn(),
  select: vi.fn(),
  insert: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  eq: vi.fn(),
  order: vi.fn(),
  maybeSingle: vi.fn(),
  single: vi.fn()
}));

vi.mock('@/lib/admin', async () => ({
  ...await vi.importActual<typeof import('../src/lib/admin')>('../src/lib/admin'),
  requireAdmin: mocks.admin
}));

import { GET, PATCH, DELETE } from '../src/app/api/admin/inquiries/route';
import { POST as publicPOST } from '../src/app/api/inquiries/route';

beforeEach(() => {
  vi.resetAllMocks();

  const chain = {
    select: mocks.select.mockReturnThis(),
    insert: mocks.insert.mockReturnThis(),
    update: mocks.update.mockReturnThis(),
    delete: mocks.delete.mockReturnThis(),
    eq: mocks.eq.mockReturnThis(),
    order: mocks.order.mockReturnThis(),
    maybeSingle: mocks.maybeSingle,
    single: mocks.single
  };

  mocks.from.mockReturnValue(chain);
  mocks.admin.mockResolvedValue({ from: mocks.from });
});

it('lists inquiries from the dedicated inquiries table', async () => {
  mocks.order.mockResolvedValue({
    data: [{
      id: '99999999-9999-9999-9999-999999999999',
      client_name: 'Priya & Arjun',
      email: 'priya@example.com',
      category: 'Wedding',
      template_name: 'Royal Heritage',
      message: 'Looking for a royal wedding invite',
      status: 'New Inquiry',
      created_at: new Date().toISOString()
    }],
    error: null
  });

  const response = await GET(new Request('https://site.test/api/admin/inquiries'));
  expect(response.status).toBe(200);
  const data = await response.json();
  expect(data).toHaveLength(1);
  expect(data[0].client_name).toBe('Priya & Arjun');
});

it('allows admin to update category and status on an inquiry', async () => {
  const id = '5bc55f29-7c46-42b2-89d9-f37c0c46cd26';
  mocks.maybeSingle.mockResolvedValue({
    data: { id },
    error: null
  });

  const response = await PATCH(new Request('https://site.test/api/admin/inquiries', {
    method: 'PATCH',
    body: JSON.stringify({
      id,
      category: 'Anniversary',
      status: 'Contacted'
    })
  }));

  expect(response.status).toBe(200);
  expect(mocks.update).toHaveBeenCalledWith(expect.objectContaining({
    category: 'Anniversary',
    status: 'Contacted'
  }));
});

it('allows admin to delete an inquiry', async () => {
  const id = '5bc55f29-7c46-42b2-89d9-f37c0c46cd26';
  mocks.delete.mockReturnValue({
    eq: vi.fn().mockReturnValue({
      eq: vi.fn().mockResolvedValue({ error: null })
    })
  });

  const response = await DELETE(new Request(`https://site.test/api/admin/inquiries?id=${id}`));
  expect(response.status).toBe(200);
  expect(mocks.delete).toHaveBeenCalled();
});
