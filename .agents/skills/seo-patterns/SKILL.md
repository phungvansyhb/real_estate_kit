---
name: seo-patterns
description: Khi cần tối ưu SEO technical và on-page cho page hoặc route trong ListingKit/Next.js App Router: metadata, canonical, Open Graph, structured data, sitemap, robots, internal linking, slug, và content structure cho landing page public.
---

# SEO Patterns for ListingKit

Dùng skill này khi bạn cần thiết kế hoặc tối ưu SEO cho các page public trong ListingKit, đặc biệt là:

- `app/page.tsx` và các landing page marketing
- `app/l/[slug]/page.tsx` và các trang listing public
- `app/layout.tsx`, `app/sitemap.ts`, `app/robots.ts`
- metadata động cho route segment trong Next.js App Router
- Open Graph, Twitter card, canonical URL, JSON-LD, internal linking

Không dùng skill này cho dashboard private, auth flow, hay page không cần index trừ khi mục tiêu là thêm `noindex`.

## Mục tiêu

Khi áp dụng skill này, hãy ưu tiên:

1. Tăng khả năng index đúng cho page public.
2. Tăng CTR từ search/social bằng title, description, OG hợp lý.
3. Giảm duplicate content giữa các listing và page marketing.
4. Giữ implementation đúng chuẩn Next.js App Router và dễ maintain.

## Quy trình làm việc

### 1. Xác định page có nên được index không

- **Index**: homepage, pricing/marketing pages, public listing pages, city/category pages nếu có nội dung thật.
- **Noindex**: dashboard, onboarding private, auth pages, preview-only pages, trạng thái rỗng hoặc duplicate.
- Nếu page private nhưng vẫn public URL, cân nhắc thêm `robots: { index: false, follow: false }` trong metadata.

### 2. Dùng Metadata API của Next.js trước tiên

Ưu tiên các pattern sau:

- Static page: export `metadata`
- Dynamic page: export `generateMetadata`
- Site-wide defaults: đặt ở `app/layout.tsx`

Luôn ưu tiên `alternates.canonical`, `openGraph`, `twitter`, và `robots` thay vì tự chèn thẻ meta thủ công.

### 3. Title và description

- Mỗi page cần title riêng, mô tả đúng intent tìm kiếm.
- Tránh title quá generic như `Dashboard` hoặc `Listing Details` trên page public.
- Với listing page, title nên ghép từ các trường quan trọng theo thứ tự dễ scan:
  - loại bất động sản
  - khu vực hoặc địa chỉ ngắn
  - diện tích / số phòng nếu hữu ích
  - thương hiệu ListingKit nếu còn chỗ
- Meta description nên tóm tắt lợi ích thực sự của listing: vị trí, diện tích, giá, điểm nổi bật, CTA nhẹ.
- Không nhồi từ khóa. Nếu dữ liệu nghèo nàn, viết tự nhiên và ngắn gọn hơn.

### 4. Canonical và slug

- Mỗi page public phải có canonical URL rõ ràng.
- Với listing page, canonical phải dùng slug chuẩn duy nhất.
- Nếu có tracking params (`utm_*`, `fbclid`, v.v.), canonical luôn trỏ về URL sạch.
- Nếu thấy slug có nguy cơ trùng hoặc thay đổi theo tiêu đề, đề xuất cơ chế slug ổn định ở layer dữ liệu.

### 5. Open Graph và Twitter

Cho page public, thêm:

- `openGraph.title`
- `openGraph.description`
- `openGraph.url`
- `openGraph.images`
- `twitter.card = "summary_large_image"`

Với listing page:

- Ưu tiên ảnh cover/listing hero làm OG image.
- Nếu chưa có ảnh riêng, fallback về ảnh mặc định có branding.
- Không dùng ảnh mờ, ratio quá xấu, hoặc URL không public.

### 6. Structured data

Nếu page là listing public, cân nhắc thêm JSON-LD bằng `script type="application/ld+json"` trong Server Component.

Ưu tiên mô hình dữ liệu đơn giản, đúng dữ liệu đang có. Chỉ thêm field bạn thật sự biết.

Gợi ý:

- Organization / WebSite cho homepage
- BreadcrumbList cho page có phân cấp điều hướng
- Listing page: mô tả property + offer + address ở mức dữ liệu hiện có

Không bịa structured data. Nếu thiếu dữ liệu địa chỉ đầy đủ, toạ độ, hoặc giá, hãy bỏ field đó thay vì đoán.

### 7. Nội dung và heading structure

- Mỗi page public cần đúng một `h1` phản ánh intent chính.
- Các section tiếp theo dùng `h2` / `h3` có thứ bậc hợp lý.
- Nội dung phải giúp người dùng ra quyết định, không chỉ lặp lại title.
- Với listing page, nên có các nhóm nội dung rõ ràng:
  - tóm tắt tài sản
  - tiện ích / điểm nổi bật
  - vị trí
  - gallery
  - CTA liên hệ / đặt lịch

### 8. Internal linking

- Homepage nên link tới pricing, demo listing, dashboard CTA nếu phù hợp.
- Public listing nên link ngược về homepage hoặc các listing liên quan nếu có.
- Anchor text nên mô tả được đích đến, tránh quá nhiều `xem thêm` lặp lại.

### 9. Sitemap và robots

Nếu dự án chưa có:

- thêm `app/sitemap.ts`
- thêm `app/robots.ts`

Nguyên tắc:

- Chỉ đưa page public, canonical vào sitemap.
- Không đưa dashboard/auth/private route vào sitemap.
- `robots.ts` nên chặn các khu vực private nếu cần.

### 10. Performance và indexability

SEO không tách rời UX. Khi chỉnh page public:

- ưu tiên Server Component nếu không cần client interactivity
- dùng `next/image` cho ảnh public khi phù hợp
- tránh render blocked bởi client-only code không cần thiết
- đảm bảo nội dung chính có trong HTML ban đầu khi có thể

## Checklist nhanh

Đọc thêm checklist tại `checklists/page-seo-checklist.md` và dùng nó trước khi kết thúc task SEO.

## Ưu tiên theo loại page trong ListingKit

### Homepage / marketing

- Title rõ value proposition cho môi giới bất động sản
- Mô tả nêu landing page, lead capture, QR code, AI description
- Thêm Organization/WebSite JSON-LD nếu hợp lý
- Có CTA rõ và internal links tới các phần quan trọng

### Public listing page

- Metadata động từ dữ liệu listing
- Canonical theo slug
- OG image từ cover image
- Mô tả khác nhau giữa các listing để tránh duplicate
- Có structured data ở mức tối thiểu nhưng đúng dữ liệu
- CTA lead form hiển thị rõ trên mobile

### Dashboard / auth

- Không index
- Không cần đầu tư OG/SEO trừ khi có yêu cầu đặc biệt

## Cách ra quyết định khi implement

Khi làm SEO task, hãy theo thứ tự ưu tiên:

1. Sửa indexability và canonical trước.
2. Sau đó sửa title/description/OG.
3. Sau đó thêm structured data.
4. Cuối cùng mới tối ưu content wording hoặc internal links.

Nếu user yêu cầu “SEO” chung chung, hãy audit nhanh các file public sau trước:

- `app/layout.tsx`
- `app/page.tsx`
- `app/l/[slug]/page.tsx`
- `app/sitemap.ts`
- `app/robots.ts`

Rồi đề xuất thay đổi nhỏ, có tác động cao trước.
