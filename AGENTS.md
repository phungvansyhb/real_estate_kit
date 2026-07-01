# ListingKit — Project Instructions for Agents

## Dự án
ListingKit là Micro-SaaS giúp môi giới bất động sản tạo landing page cho từng căn nhà.
Stack: **Next.js 16 (App Router) · TypeScript · Tailwind CSS · Shadcn/ui · Supabase · Stripe · Vercel**

## Làm việc trong repo này

- Ưu tiên đọc và sửa ngay trong các file hiện có thay vì tạo file mới không cần thiết.
- Câu trả lời và thay đổi phải bám vào cấu trúc thực tế của repo; nếu cần chi tiết hơn, hãy link sang [README.md](README.md) thay vì lặp lại nội dung.
- Lệnh chính để chạy dự án là `npm run dev`, `npm run build`, và `npm run lint`.

---

## Nguyên tắc code chung

- Luôn dùng **TypeScript strict mode** — không dùng `any`, không suppress lỗi type.
- Ưu tiên **Server Components** theo mặc định; chỉ thêm `"use client"` khi cần thiết (event handler, hooks, browser API).
- Đặt tên file theo chuẩn **kebab-case** (`listing-card.tsx`, `use-listing.ts`).
- Export mặc định chỉ dùng cho **page/layout**; còn lại dùng named export.
- Không commit secret, API key, hay thông tin nhạy cảm vào source code.
- Mọi text hiển thị trên giao diện phải đi qua `messages/en.json` và `messages/vi.json` qua `getLocaleMessages()`; không hardcode chuỗi UI trong component nếu có thể tránh được.
- Các button luôn phải có icon đi kèm. Text đứng trước icon.
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
│   ├── db/                 # DB client, schema, migrations, repository implementations
│   ├── repositories/       # Repository interfaces + adapters cho data access
│   ├── services/           # Business use cases / orchestration
│   ├── supabase/           # Supabase clients + adapters cho auth/storage/realtime
│   ├── stripe/             # Stripe helpers
│   └── utils.ts            # cn(), formatPrice(), ...
├── types/                  # TypeScript types & Supabase generated types
└── hooks/                  # Custom React hooks (use-listing.ts, ...)
```

## Routes quan trọng

- Public listing page: `app/l/[slug]/page.tsx` và localized variants trong `app/[locale]/l/[slug]/page.tsx`.
- Locale shell: `app/[locale]/layout.tsx` dùng `next-intl` provider và `i18n/routing.ts`.
- Auth routes: `app/[locale]/(auth)/login` và `app/[locale]/(auth)/signup`.
- Dashboard routes: `app/dashboard` và các sub-route trong đó.

---

## Kiến trúc dữ liệu 3 layer

Để giảm coupling với Supabase SDK và giữ khả năng migrate sau này, mọi logic data phải đi theo 3 layer sau:

1. **Presentation layer**
   - Gồm `app/`, `components/`, `hooks/`.
   - Chỉ render UI, nhận input, gọi service.
   - **Không được** chứa query Supabase trực tiếp.

2. **Service layer**
   - Đặt trong `lib/services/`.
   - Chứa business logic/use case: tạo tin đăng, publish trang, tạo khách quan tâm, tính quota, v.v.
   - Service gọi repository interface hoặc adapter tương ứng.

3. **Data access layer**
   - Đặt trong `lib/repositories/`, `lib/db/`, `lib/supabase/`.
   - Chịu trách nhiệm nói chuyện với Postgres/Supabase/Storage/Auth.
   - Chỉ layer này mới được phép dùng query builder, SQL client, hoặc Supabase SDK.

### Quy tắc decoupling với Supabase

- **Không import Supabase SDK trực tiếp** trong `app/`, `components/`, `hooks/`, hoặc feature modules.
- Nếu dùng Supabase cho **database CRUD**, hãy bọc qua repository implementation như `supabase-listing-repository.ts` thay vì gọi `.from()` ngay trong page/component.
- Nếu dùng Supabase cho **Auth**, **Storage**, hoặc **Realtime**, hãy cô lập trong adapter/provider riêng dưới `lib/supabase/`, `lib/auth/`, `lib/storage/`.
- Tầng trên chỉ làm việc với interface/type của app, không phụ thuộc response shape `{ data, error }` của Supabase.
- Khi cần đổi provider sau này, ưu tiên chỉ thay implementation ở data access layer, không sửa business logic và UI.

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
- Khi tạo nút hành động, ưu tiên icon từ `lucide-react` và giữ thứ tự label trước icon.

### Data Fetching
- **Server Components**: gọi qua `service` hoặc `repository`, không fetch trực tiếp bằng Supabase SDK trong page.
- **Client Components**: dùng `@tanstack/react-query` nếu cần realtime hoặc mutate; query function vẫn phải đi qua service/API layer.
- Luôn xử lý loading state và error state — không để UI trống không có feedback.
- Query cho public page nên ưu tiên ở server để tốt cho SEO và performance.

### Services
- Mọi business rule phải nằm trong `lib/services/`, không nhét vào page/component.
- Service không render UI và không phụ thuộc framework-specific response object nếu không cần thiết.
- Service orchestration ví dụ: tạo tin đăng, publish subdomain, nhận khách quan tâm, tính giới hạn gói, ghi nhận analytics.

### Database & Repositories
- Repository interface nằm ở `lib/repositories/`; implementation có thể dùng Postgres, Drizzle, Supabase, hoặc provider khác.
- Chỉ data access layer mới được phép xử lý response kiểu `{ data, error }` của Supabase.
- Ở tầng repository/service, map dữ liệu sang type nội bộ của app; không để Supabase response shape rò rỉ lên UI.
- Dùng **Supabase generated types** từ `types/database.types.ts` khi làm việc với Supabase schema; không tự viết type DB thủ công nếu đã có generated types.
- Row Level Security (RLS) phải được enable cho mọi table khi dùng Supabase production — không bỏ qua vì "tiện".
- Nếu business data cần dễ migrate, ưu tiên định nghĩa contract/repository trước, rồi mới chọn implementation Supabase/Postgres ở dưới.

### API Routes
- Đặt trong `src/app/api/` theo chuẩn App Router (`route.ts`).
- Luôn validate request body bằng **Zod** trước khi xử lý.
- Route handler nên gọi `service`, không chứa business logic hoặc query Supabase inline trừ glue code rất mỏng.
- Trả về response chuẩn: `{ data, error }` hoặc HTTP error code rõ ràng.

### i18n
- Dùng `next-intl` và `i18n/routing.ts` cho locale-aware routes.
- Thêm string mới vào cả `messages/en.json` và `messages/vi.json` cùng lúc.
- Nếu cần text dùng trong nhiều nơi, đặt key rõ nghĩa trong messages thay vì duplicate literal strings.

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
- KHÔNG import hoặc gọi Supabase SDK trực tiếp trong `app/`, `components/`, `hooks/`.
- KHÔNG đặt query `.from(...)`, auth flow, hoặc storage operation rải rác khắp codebase — phải bọc qua service/repository/adapter.
- KHÔNG để business logic phụ thuộc trực tiếp vào response shape hoặc helper đặc thù của Supabase nếu có thể abstraction được.
- KHÔNG hardcode string tiếng Việt vào component — đặt vào constants hoặc i18n nếu cần scale.
- KHÔNG tạo file dài hơn 300 dòng — tách component/hook nhỏ hơn.
- KHÔNG bỏ qua TypeScript error bằng `@ts-ignore` hay `as any`.
- KHÔNG tự viết UI component từ đầu nếu shadcn đã có — dùng `/shadcn-ui` skill để kiểm tra trước.
- KHÔNG cài thêm thư viện UI song song với shadcn (MUI, Chakra, Ant Design…).
- KHÔNG import trực tiếp từ `@radix-ui/*` — luôn đi qua `@/components/ui/`.
- KHÔNG dùng inline style (`style={{}}`) cho màu sắc hay spacing — dùng Tailwind class.
- KHÔNG tạo variant màu mới trong Tailwind nếu đã có CSS variable tương đương trong `globals.css`.

## Tài liệu liên quan

- [README.md](README.md) cho thông tin tổng quan dự án và thiết lập ban đầu.
- Nếu cần tối ưu hoặc sửa quy ước agent, ưu tiên cập nhật chính file này thay vì tạo thêm lớp hướng dẫn mới.
