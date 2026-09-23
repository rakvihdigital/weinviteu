# WeInviteU V3 — a new website and twelve distinct invitation designs

This update replaces the previous reference-inspired homepage and repeated invitation-card design with an original editorial studio direction: warm paper, charcoal, terracotta and pale green; a three-card collage; a design directory; and an interactive 3D experience section.

**Database work remains deferred.** The complete Next.js frontend works without Supabase credentials. The optional Supabase client and integration notes are included for later.

## Run

Use Node.js 24 LTS (24.15.0+) or Node.js 22.22.2+. Extract the ZIP and open its `weinviteu` folder.

```bash
npm install
npm run dev
```

Visit http://localhost:3000, or the address printed by Next.js.

For your Windows folder, read **docs/UPDATE-WINDOWS.md**. Stop the old server and extract into a fresh `weinviteu` folder rather than copying over an old build.

## What is different

The designs have different markup, typography, artwork and compositions—not just new colours. The selected design is used in the gallery, editor, full preview and public invitation. Guest-section styling also varies by design family.

| Design | Composition | Default occasion |
| --- | --- | --- |
| Palace of Promises | Architectural window, regal symmetry and copper ornament | Wedding |
| Botanical Conservatory | Botanical frame and asymmetric letter | Wedding |
| The Love Gazette | Newspaper masthead, columns, headline and date stamp | Engagement |
| Midnight Pass | Event ticket, perforated stub and electric accents | Birthday |
| Over the Rainbow | Layered rainbow, clouds and rounded composition | Baby celebration |
| A Place Called Home | Architectural line drawing, grid and address label | Housewarming |
| Our Golden Record | Vinyl record, sleeve and personalised track details | Anniversary |
| Marigold Mandala | Geometric mandala, marigold strings and diya | Pooja |
| The Assembly | Swiss grid, large date and graphic typography | Corporate |
| Vows, Vol. 01 | Magazine-cover layout and oversized ampersand | Wedding |
| Disco After Dark | Mirror-ball illustration, poster type and checkerboard trim | Birthday |
| Written in the Stars | Crescent, constellations and orbit lines | Engagement |

The older template IDs are retained so existing routes still resolve. Their displayed names and rendered designs have changed.

## Change a design without losing your details

Open **Create invitation → Style → Invitation design**.

The selector changes the design, palette, typography and default entrance while retaining event names, date/time, venue, story, gallery, soundtrack and RSVP choices. The preview updates immediately. Full preview and shared links retain the selected design.

The separate 3D opening selector supports Palace, Garden and Celestial entrances. The twelve invitation compositions share these three entrance models; there are not twelve separately modelled 3D scenes.

## 3D and audio

- Procedural Three.js palace architecture, opening gates, botanical variations and particles.
- Pointer parallax; reduced-motion preferences are respected.
- CSS gate fallback when WebGL is unavailable.
- Dynamic Three.js loading, capped pixel density, offscreen rendering checks and disposal on unmount.
- Three original 32-second local soundtracks: piano, bells and ambient.
- Guest audio player with play/pause, volume, mute and error feedback.
- The opening click can start music; guests may uncheck **Open with music**.
- A public HTTPS audio URL can be entered in **Extras** for your own licensed soundtrack.

The gallery illustrations, template artwork and audio are original project assets. Local image/video uploads are not implemented. The motion section is animated artwork, not a supplied video.

## Pages

| Route | Purpose |
| --- | --- |
| `/` | New invitation-studio homepage and interactive 3D lab |
| `/designs` | Twelve-design directory, search and occasion filters |
| `/designs/<template-id>` | Dedicated page for each of the 24 designs (for example `/designs/golden-hour`) |
| `/create?template=[id]` | Live editor and design switcher |
| `/preview#...` | Full guest preview and return to editor |
| `/invite/arjun-priya` | Example invitation |
| `/invite/[template-id]` | Guest demo for a selected template |
| `/invite/custom#...` | Self-contained shared invitation |
| `/how-it-works` | Workflow and FAQs |
| `/about` | Brand story |

## Demo behaviour

No database, authentication, payment gateway, permanent RSVP collection or media storage is connected. RSVP responses are explicitly labelled as a demonstration and are not saved or sent.

Edits live in React state. Export your invitation as JSON to keep it; import it through **Extras** later. Refreshing or leaving without an export or preview link discards unsaved edits. Returning from Full preview preserves the encoded state.

Shared links contain the invitation JSON encoded in the URL fragment. The contents are not encrypted. Anyone with the complete link can read its details. This lets the demo work without a database. Long stories produce long links; a production database should replace these with short, random invitation slugs. Old links without the new `design` field are mapped to the matching design using their template ID.

A localhost link only works on your own computer. Deploy the app before sharing a link with guests on other devices.

## Supabase later

Copy `.env.example` to `.env.local` and add your project's URL and publishable key when ready. Do not put a secret/service-role key in a `NEXT_PUBLIC` variable.

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
```

`src/lib/supabase/client.ts` creates a client only when called and configured. Adding these values does not turn the prototype into a production backend. Follow **docs/SUPABASE-LATER.md** for schema, authentication, RLS, publishing and media-storage boundaries.

## Main files

- `src/app/page.tsx` — new studio homepage.
- `src/app/studio.css` — site design system and responsive page styles.
- `src/app/designs.css` — twelve compositions and guest-layout variations.
- `src/components/InvitationCard.tsx` — distinct template structures.
- `src/components/DesignArtwork.tsx` — original vector illustrations.
- `src/data/templates.ts` — design names, metadata, descriptions and default styles.
- `src/data/designs.ts` — design registry and backward-compatible ID mapping.
- `src/components/Builder.tsx` — controls and content-preserving design switching.
- `src/components/PalaceScene.tsx` — Three.js scene and fallback.
- `src/components/AudioPlayer.tsx` — soundtrack controls.
- `src/components/ExperienceLab.tsx` — homepage 3D/audio demonstration.
- `src/lib/repository.ts` — replaceable data boundary.

`globals.css` supplies shared base styles, and `cinematic.css` retains V2's 3D/audio component styles. The later-imported `studio.css` and `designs.css` define V3's visual identity.

## Verify and deploy

```bash
npm run test
npm run typecheck
npm run lint
npm run build
npm start
```

The ZIP excludes node_modules and build output. The dependency lockfile is included; use `npm ci` for a locked install. See **docs/VERIFICATION.md** for what was tested and the remaining browser checks.

Deploy through a Next.js-compatible host using `npm run build`. Configure your real canonical domain and sitemap before a public launch. Preview, editor and invitation routes remain marked noindex.

