Goal
Continue evolving `ListingKit` in `C:\Users\63200467\Documents\codes\real_estate_kit` into a polished public-facing prototype with:
- strong SEO for public pages
- bilingual support (`vi` / `en`)
- homepage testimonials/reviews
- more natural, sales-oriented copy
- **maximum Vietnamese localization when locale is `vi`**
- **all buttons should include icons, with text before icon**

The user’s latest preference is explicit:
- avoid English words on Vietnamese UI where possible (`listing`, `lead`, `dashboard`, etc.)
- keep the copy sounding like a real estate agent / product for agents, not a dev prototype

---

## State

### What was already done before this turn
The app already had a working `v0.1` prototype:
- homepage
- dashboard
- create listing flow
- public listing page
- AI description demo route
- leads API
- QR code API
- mock data only
- no real Supabase/auth/billing yet

Previously completed:
- localized public routes:
  - `/vi`
  - `/en`
  - `/vi/l/[slug]`
  - `/en/l/[slug]`
- `/` redirects to `/vi`
- `/l/[slug]` redirects to localized route
- SEO infra added:
  - `app/sitemap.ts`
  - `app/robots.ts`
  - `lib/seo.ts`
  - metadata in `app/layout.tsx`
  - localized metadata in `app/[locale]/page.tsx`
  - localized metadata in `app/[locale]/l/[slug]/page.tsx`
  - JSON-LD on homepage and listing pages
- multilingual copy infra added in `lib/i18n.ts`
- homepage testimonials section added
- listing page and homepage localized
- `app/dashboard/layout.tsx` marked `noindex`

### What was completed in the most recent turn
The latest pass focused on:
1. rewriting copy to be less technical / less “v1.0/demo/production”
2. then further localizing Vietnamese copy
3. adding icons to buttons and enforcing text-before-icon

#### Main updates
- Rewrote public-facing marketing copy to sound more customer-facing and agent-oriented
- Removed public-facing mentions like:
  - `v1.0`
  - `demo`
  - `production`
  - overly technical/product-dev language
- Vietnamese copy was further localized:
  - `dashboard` → `bảng điều khiển`
  - `listing` → `tin đăng`
  - `landing page` → `trang giới thiệu`
  - `lead` → `khách quan tâm` / `yêu cầu xem nhà`
  - `QR code` → `mã QR`
- Many button labels now include icons, with **text first, icon second**

### Files changed in this latest pass
- `lib/i18n.ts`
- `app/layout.tsx`
- `app/[locale]/page.tsx`
- `app/api/leads/route.ts`
- `components/features/home-page.tsx`
- `components/features/listing-card.tsx`
- `components/features/lead-form.tsx`
- `components/features/qr-download-button.tsx`
- `app/[locale]/l/[slug]/page.tsx`
- `app/dashboard/page.tsx`
- `app/dashboard/listings/new/page.tsx`
- `components/features/create-listing-form.tsx`
- `app/not-found.tsx`

### Validation status
Current state is passing:
- `npm run lint` ✅
- `npm run build` ✅

Build confirms routes still generate successfully:
- `/[locale]`
- `/[locale]/l/[slug]`
- `/robots.txt`
- `/sitemap.xml`

---

## Context

### Project constraints / rules
From `AGENTS.md` and project instructions:
- TypeScript strict mode
- no `any`
- no `@ts-ignore`
- App Router only
- prefer Server Components by default
- Tailwind only
- use `shadcn/ui`
- all buttons should have icons, and **text must come before icon**
- file names in kebab-case
- default export only for page/layout
- no inline styling for spacing/colors
- avoid files > 300 lines where possible
- conventional commits if asked later

### User content/style preferences
Important:
- copy should **not** sound like a dev preview, MVP, prototype, v1.0, etc. on public surfaces
- descriptions/intro should be written from the perspective of helping a real estate agent sell better
- when locale is `vi`, the UI should be as fully Vietnamese as possible
- user still feels “nhiều chỗ chưa ưng” — so another content polish pass is likely wanted

### Current architecture decisions
- i18n uses localized route segments:
  - `/vi`
  - `/en`
  - `/vi/l/[slug]`
  - `/en/l/[slug]`
- Only public SEO-critical pages are localized in full:
  - homepage
  - public listing page
- Dashboard/internal create flow has begun to be Vietnamese-polished, but it is not a complete i18n system yet
- data is still mock-based
- no real persistence/auth/billing

### Critical files to inspect first
- `lib/i18n.ts`
- `components/features/home-page.tsx`
- `app/[locale]/page.tsx`
- `app/[locale]/l/[slug]/page.tsx`
- `components/features/listing-card.tsx`
- `components/features/lead-form.tsx`
- `components/features/qr-download-button.tsx`
- `app/dashboard/page.tsx`
- `app/dashboard/listings/new/page.tsx`
- `components/features/create-listing-form.tsx`
- `app/not-found.tsx`

### SEO skill note
A project-local SEO skill was created earlier at:
- `.agents/skills/seo-patterns/SKILL.md`
- `.agents/skills/seo-patterns/checklists/page-seo-checklist.md`

But runtime discovery did **not** expose it in available skills, so SEO work was done manually.

---

## Next

### Highest-value next step
Do one more careful “copy and UX polish” pass, especially for Vietnamese.

#### Specifically:
1. **Audit all Vietnamese-visible strings** for leftover English/product/dev wording
   - especially in `lib/i18n.ts`
   - `dashboard` and `create listing` flow
   - `not-found`
   - cards / labels / headings / CTA text
2. **Check every button in app and public pages**
   - confirm icon exists
   - confirm text is before icon
   - confirm no plain-text button remains
3. **Improve Vietnamese tone further**
   - more polished, premium, agent-friendly
   - less literal translation
   - unify vocabulary:
     - `tin đăng`
     - `trang giới thiệu`
     - `khách quan tâm`
     - `yêu cầu xem nhà`
     - `bảng điều khiển`
4. Optionally, after copy polish:
   - refactor `lib/i18n.ts` into smaller files (`config`, `home`, `listing`)
   - localize internal surfaces more systematically
   - create dedicated pricing/about pages for stronger SEO

### Good concrete files to revise next
- `lib/i18n.ts`:
  - still large and likely has more wording to polish
  - check Vietnamese copy for phrases like `Team lead`, `link`, etc.
- `components/features/home-page.tsx`
  - some English remains intentionally for `en`, but ensure `vi` path uses strong localized terminology
- `components/features/create-listing-form.tsx`
  - internal UX wording can still be improved
- `app/dashboard/page.tsx`
  - still a mixed internal/prototype page; now more polished, but likely can be improved further

---

## Pitfalls

### Tooling / runtime issues encountered
- The SEO skill was created locally but was **not discoverable** by the runtime skill list
- Large file edits sometimes caused truncation problems; smaller targeted `edit_file` patches worked better
- `lib/i18n.ts` had a couple of syntax errors introduced during rapid copy edits:
  - missing commas
  - accidentally replacing a keyed property with a raw string
- After those fixes, lint/build passed again

### Content pitfalls
- Be careful not to over-localize brand names or proper nouns:
  - `ListingKit` should remain as product brand
  - `Zalo` remains `Zalo`
- For English locale, keep English natural; don’t mirror Vietnamese terminology awkwardly
- The user is sensitive to tone: they want marketing copy that feels useful and credible, not “tech/product/dev build” language