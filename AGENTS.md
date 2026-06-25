# ListingKit — Project Instructions for Zed Agent

## Dự án
ListingKit là Micro-SaaS giúp môi giới bất động sản tạo landing page cho từng căn nhà.
Stack: **Next.js 16 (App Router) · TypeScript · Tailwind CSS · Shadcn/ui · Supabase · Stripe · Vercel**

---

## Nguyên tắc code chung

- Luôn dùng **TypeScript strict mode** — không dùng `any`, không suppress lỗi type.
- Ưu tiên **Server Components** theo mặc định; chỉ thêm `"use client"` khi cần thiết (event handler, hooks, browser API).
- Đặt tên file theo chuẩn **kebab-case** (`listing-card.tsx`, `use-listing.ts`).
- Export mặc định chỉ dùng cho **page/layout**; còn lại dùng named export.
- Không commit secret, API key, hay thông tin nhạy cảm vào source code.
- Sử dụng hai ngôn ngữ: **vi** (Tiếng Việt) và **en** (Tiếng Anh).
- Các button luôn phải có icon đi kèm (ví dụ: `createListing` phải có icon `plus`). Text trước icon.
---

## Cấu trúc thư mục (App Router)

```
src/
├── app/                    # Pages & layouts (App Router)
│   ├── (auth)/             # Route group: login, register
│   ├── (dashboard)/        # Route group: dashboard môi giới
│   ├── l/[slug]/           # Public listing page
│   └── api/                # API routes (webhooks, etc.)
├── components/
│   ├── ui/                 # Shadcn/ui base — KHÔNG sửa trừ khi cần thiết
│   ├── primitives/         # Wrapper nhẹ với preset của ListingKit
│   └── features/           # Feature components (listing-card, lead-form...)
├── lib/
│   ├── supabase/           # Supabase client (server.ts, client.ts, middleware.ts)
│   ├── stripe/             # Stripe helpers
│   └── utils.ts            # cn(), formatPrice(), ...
├── types/                  # TypeScript types & Supabase generated types
└── hooks/                  # Custom React hooks (use-listing.ts, ...)
```

---

## Quy tắc theo từng layer

### Components & UI Library
- **Shadcn/ui là UI library duy nhất** — không cài thêm MUI, Ant Design, Chakra hay bất kỳ thư viện UI nào khác.
- Trước khi tạo UI element mới, **kiểm tra shadcn đã có chưa** bằng `/shadcn-ui` skill.
- Cấu trúc component theo 3 tầng:
  - `components/ui/` — shadcn gốc, không sửa tuỳ tiện
  - `components/primitives/` — wrap nhẹ với style/variant cố định của project (ví dụ: `AppButton`, `ListingBadge`)
  - `components/features/` — composition business logic (ví dụ: `ListingCard`, `LeadForm`)
- Nếu dùng cùng 1 shadcn component với cùng className ở **3+ nơi** → tạo primitive wrapper, không copy-paste.
- Cài component mới: `npx shadcn@latest add <component-name>`
- Props interface đặt ngay trên component, không để file riêng trừ khi dùng lại nhiều nơi.
- Không đặt business logic trong component — tách vào `hooks/` hoặc `lib/`.

### Data Fetching
- **Server Components**: fetch trực tiếp qua Supabase server client, không cần SWR/React Query.
- **Client Components**: dùng `@tanstack/react-query` nếu cần realtime hoặc mutate.
- Luôn xử lý loading state và error state — không để UI trống không có feedback.

### Database (Supabase)
- Mọi query Supabase phải destructure `{ data, error }` và xử lý `error` trước khi dùng `data`.
- Dùng **Supabase generated types** từ `types/database.types.ts` — không tự viết type DB thủ công.
- Row Level Security (RLS) phải được enable cho mọi table — không bỏ qua vì "tiện".

### API Routes
- Đặt trong `src/app/api/` theo chuẩn App Router (`route.ts`).
- Luôn validate request body bằng **Zod** trước khi xử lý.
- Trả về response chuẩn: `{ data, error }` hoặc HTTP error code rõ ràng.

### Styling
- Dùng **Tailwind CSS** — không dùng inline style hay CSS module trừ khi thật sự cần animation phức tạp.
- Class order: layout → spacing → sizing → color → typography → state (`hover:`, `focus:`).
- Dùng `cn()` từ `lib/utils.ts` để merge class có điều kiện.

---

## Commit message convention

Dùng **Conventional Commits**:
```
feat(listing): add QR code export button
fix(auth): redirect after login không hoạt động trên mobile
chore: update supabase types
```

---

## Những điều KHÔNG làm

- KHÔNG dùng `pages/` router — dự án này dùng App Router hoàn toàn.
- KHÔNG gọi Supabase client-side với service role key.
- KHÔNG hardcode string tiếng Việt vào component — đặt vào constants hoặc i18n nếu cần scale.
- KHÔNG tạo file dài hơn 300 dòng — tách component/hook nhỏ hơn.
- KHÔNG bỏ qua TypeScript error bằng `@ts-ignore` hay `as any`.
- KHÔNG tự viết UI component từ đầu nếu shadcn đã có — dùng `/shadcn-ui` skill để kiểm tra trước.
- KHÔNG cài thêm thư viện UI song song với shadcn (MUI, Chakra, Ant Design…).
- KHÔNG import trực tiếp từ `@radix-ui/*` — luôn đi qua `@/components/ui/`.
- KHÔNG dùng inline style (`style={{}}`) cho màu sắc hay spacing — dùng Tailwind class.
- KHÔNG tạo variant màu mới trong Tailwind nếu đã có CSS variable tương đương trong `globals.css`.
