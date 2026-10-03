# WeInviteU

Next.js invitation storefront and administrator workspace, backed by Supabase.

## Setup

Use Node.js 24.15+ or 22.22.2+. Install the locked dependencies with `npm ci`.
Create `.env.local` with:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
# Optional email delivery (server-only):
RESEND_API_KEY=
EMAIL_FROM=
SITE_URL=https://YOUR_SITE
```

Follow [admin setup](docs/admin-setup.md) to apply the database migration and create a Supabase Auth administrator. Existing plaintext admin credentials no longer authenticate. No service-role key belongs in this app's browser environment.

```bash
npm run dev
```

## Workflow

- `/templates`: enabled invitation templates.
- `/contact`: new inquiries.
- `/admin/login`: administrator sign-in.
- `/admin`: live order counts and recent inquiries.
- `/admin/templates`: upload, preview, edit, enable/disable, or remove templates.
- `/admin/customize`: edit text, photo slots, colors and music; save a draft or email its link.
- `/admin/orders`: search orders, reopen drafts and mark orders completed.
- `/admin/settings`: studio contact information and WhatsApp destination.
- `/invite/[id]`: sandboxed, shareable invitation.

Drafts retain their original source and structured customization. Reopening an order updates the same ID. Saved links are shareable; email provider acceptance is recorded separately from saving. Legacy invitations without editable source keep their published links, but their old customization cannot be recovered into editable state automatically.

## Verify

```bash
npm run test
npm run typecheck
npm run lint
npm run build
npm start
```

If optional native packages are missing, use `npm ci --include=optional --include=peer` with a supported Node version. See [admin setup](docs/admin-setup.md) for staging acceptance checks and deployment configuration.
