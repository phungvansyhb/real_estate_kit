# ListingKit — Product Requirements Document (PRD)

**Micro-SaaS · Bất động sản · Landing page cho từng căn nhà**  
Phiên bản 1.0 · 25/06/2026

---

## 1. Executive Summary

ListingKit là một Micro-SaaS giúp môi giới bất động sản tạo trang landing page đẹp và chuyên nghiệp cho từng căn nhà — không cần biết code, chỉ mất vài phút. Khách hàng nhận link hoặc QR code, truy cập trang, xem ảnh/video, đọc mô tả AI và đặt lịch xem nhà trực tiếp.

| Chỉ số | Mục tiêu |
|--------|----------|
| Giá gói chính | $19/tháng (Agent) — $79/tháng (Team) |
| MRR sau 12 tháng | $3,000+ |
| Thời gian build MVP | 4–6 tuần |
| Thị trường ban đầu | Môi giới BĐS tại Việt Nam & Đông Nam Á |

---

## 2. Vấn đề cần giải quyết

### 2.1 Bối cảnh thị trường

Hàng triệu môi giới bất động sản tại Việt Nam và Đông Nam Á đang phụ thuộc vào các sàn đăng tin lớn (Batdongsan.com.vn, Nhadat.com, PropertyGuru…). Tuy nhiên, các nền tảng này có những hạn chế cố hữu:

- Tin đăng bị chôn vùi giữa hàng nghìn listing cạnh tranh cùng ngày.
- Giao diện hiển thị đồng nhất, không tạo được dấu ấn thương hiệu cá nhân.
- Không có khả năng theo dõi hành vi khách hàng (ai xem, từ đâu, bao lâu).
- Để có landing page riêng cần thuê dev, tốn 5–20 triệu đồng và nhiều tuần chờ đợi.

### 2.2 Pain points cụ thể

- **Hình ảnh thương hiệu yếu:** Chia sẻ link Zalo/PDF trông thiếu chuyên nghiệp với khách hàng cao cấp.
- **Không có dữ liệu:** Môi giới không biết tin đăng nào hiệu quả, kênh nào mang lại khách.
- **Tốn thời gian soạn mô tả:** Viết mô tả căn nhà mỗi ngày tốn 20–40 phút, lặp đi lặp lại.
- **Không tận dụng được thực địa:** Banner ngoài đường không dẫn được khách đến trang thông tin chi tiết.

---

## 3. Giải pháp

ListingKit cung cấp một nền tảng no-code để môi giới tạo landing page cho mỗi listing bất động sản trong vài phút, với 4 tính năng cốt lõi:

### 3.1 Landing page tự động

Môi giới điền thông tin căn nhà (địa chỉ, diện tích, giá, tiện ích), upload ảnh/video và nhận ngay một trang web responsive, đẹp, tối ưu cho mobile. Trang có gallery ảnh, Google Maps nhúng, nút Zalo/call-to-action và form đặt lịch xem nhà.

### 3.2 AI tự động viết mô tả

Dựa trên các thông số nhập vào, hệ thống gọi API AI (OpenAI GPT-4o) để sinh ra đoạn mô tả hấp dẫn, đúng ngữ điệu bất động sản, bằng tiếng Việt. Môi giới có thể chỉnh sửa hoặc dùng thẳng — tiết kiệm 20–30 phút mỗi listing.

### 3.3 Form đặt lịch & thông báo tức thì

Khách hàng điền tên, số điện thoại, chọn khung giờ muốn xem nhà. Hệ thống gửi thông báo ngay cho môi giới qua Zalo (Zalo OA) và email, đồng thời lưu lead vào bảng quản lý.

### 3.4 Analytics & QR code

Dashboard đơn giản hiển thị: lượt xem trang, nguồn traffic (Zalo, Facebook, QR…), số lead thu được. Mỗi listing có QR code riêng để in lên banner bán nhà ngoài thực địa — khách quét điện thoại là ra trang ngay.

---

## 4. Đối tượng người dùng

### 4.1 Khách hàng chính (ICP)

| Thuộc tính | Mô tả |
|------------|-------|
| Đối tượng | Môi giới bất động sản cá nhân hoặc nhóm 2–5 người |
| Kinh nghiệm tech | Dùng smartphone thành thạo, biết dùng Facebook/Zalo, không biết code |
| Nhu cầu | Đăng tin nhanh, trông chuyên nghiệp, nhận khách chất lượng hơn |
| Ngân sách | Sẵn sàng trả < 1 triệu VND/tháng cho tool tiết kiệm thời gian |
| Kênh tiếp cận | Facebook Group môi giới, Zalo community, YouTube BĐS |

### 4.2 Secondary Users

- **Agency / sàn giao dịch nhỏ** (5–20 môi giới) muốn brand nhất quán trên toàn team.
- **Chủ đầu tư cá nhân** có 2–5 căn cho thuê muốn trang quảng cáo riêng.

---

## 5. Phạm vi tính năng

### 5.1 MVP — Giai đoạn 1 (4–6 tuần)

| Tính năng | Mô tả chi tiết |
|-----------|----------------|
| Auth & onboarding | Đăng ký/đăng nhập email, Google OAuth. Onboarding 3 bước tạo listing đầu tiên. |
| Tạo listing | Form nhập: địa chỉ, giá, diện tích, loại BĐS, số PN/WC, mô tả, tiện ích. Upload tối đa 20 ảnh. |
| AI mô tả | Nút "Tạo mô tả bằng AI" — gọi OpenAI API, trả về đoạn văn có thể chỉnh sửa. |
| Landing page public | URL dạng `listingkit.com/l/[slug]`. Responsive, gallery lightbox, Google Maps, nút Zalo/Call. |
| Form liên hệ | Khách điền tên, SĐT, ghi chú. Gửi email thông báo cho môi giới. Lưu vào bảng Leads. |
| Dashboard cơ bản | Danh sách listings, trạng thái (đang bán/đã bán), số lượt xem, số leads. |
| QR code | Xuất QR code PNG cho mỗi listing để in ấn. |
| Billing | Stripe Checkout — Free, Starter $19/tháng, Pro $49/tháng. Cancel anytime. |

### 5.2 Giai đoạn 2 (tháng 3–6)

- Thông báo Zalo OA khi có lead mới
- Custom domain (`pro.moigioi.com` thay vì `listingkit.com/l/...`)
- Video embed (YouTube/TikTok)
- Tour 360° (embed Matterport/Kuula)
- Bảng quản lý leads với note và trạng thái theo dõi
- Analytics nâng cao: heatmap click, nguồn traffic chi tiết
- Template đa dạng (tối giản, hiện đại, sang trọng)
- Bulk import từ file Excel

### 5.3 Ngoài phạm vi MVP

- Tích hợp CRM phức tạp (Salesforce, HubSpot)
- App mobile native (iOS/Android)
- Thanh toán qua VNPay/MoMo (giai đoạn sau)
- Chatbot AI tư vấn trực tiếp trên trang listing

---

## 6. Chiến lược giá

| Gói | Giá | Listings | Tính năng chính |
|-----|-----|----------|-----------------|
| Free | $0 | 3 listing | Watermark logo, form liên hệ, QR code |
| Starter | $19/tháng | 20 listing | Không watermark, AI mô tả, analytics cơ bản, email thông báo |
| Pro | $49/tháng | Không giới hạn | Custom domain, team 5 người, analytics nâng cao, priority support |

> **Lý do chọn mức giá $19–49:** phù hợp với ngưỡng ra quyết định nhanh của môi giới cá nhân (< 1 triệu VND/tháng), và thấp hơn đáng kể so với chi phí thuê dev làm trang tương đương.

---

## 7. Tech Stack đề xuất

### Frontend

| Công nghệ | Vai trò |
|-----------|---------|
| Next.js 14+ (App Router) | Framework chính — SSR, tối ưu SEO cho các trang listing |
| Tailwind CSS | Styling — utility-first, nhanh và nhất quán |
| Vercel | Deploy — edge CDN toàn cầu, zero-config |

### Backend & Database

| Công nghệ | Vai trò |
|-----------|---------|
| Supabase | Auth, PostgreSQL, Storage ảnh — all-in-one, generous free tier |
| Cloudflare Images | Lưu trữ và CDN ảnh listing — rẻ hơn S3 cho ảnh nhiều |
| OpenAI API (GPT-4o mini) | Sinh mô tả bất động sản tự động |

### Billing & Infra

| Công nghệ | Vai trò |
|-----------|---------|
| Stripe | Subscription management, webhook, customer portal |
| qrcode (npm) | QR code generation phía server |
| Resend | Gửi email lead notification — free đến 100 email/ngày |

> **Lý do lựa chọn stack này:** toàn bộ là công nghệ quen thuộc với web developer Việt Nam. Chi phí infrastructure dưới $20/tháng ở giai đoạn MVP (Vercel Hobby + Supabase Free). Không cần DevOps — focus 100% vào product.

---

## 8. Go-to-Market Strategy

### 8.1 Giai đoạn 0 — Validate trước khi build (tuần 1–2)

- Tham gia 5–10 group Facebook môi giới BĐS, đăng bài hỏi về pain point.
- Phỏng vấn trực tiếp 10–15 môi giới để xác nhận vấn đề và mức giá sẵn lòng trả.
- Tạo landing page waitlist đơn giản — đặt mục tiêu 50 email đăng ký trước launch.

### 8.2 Giai đoạn 1 — Launch & traction (tháng 1–3)

- Offer "Early Adopter": 3 tháng miễn phí cho 20 người dùng đầu tiên đổi lấy feedback chi tiết.
- Đăng demo video Reels/TikTok: "Tôi tạo trang listing trong 3 phút" — format trực quan, viral-friendly.
- Seed communities: group môi giới Facebook (Hà Nội, HCM), Zalo community BĐS.
- Product Hunt launch sau khi có 10 paying customers và testimonials.

### 8.3 Giai đoạn 2 — Scale (tháng 4–12)

- Affiliate program: môi giới giới thiệu môi giới — commission 20% tháng đầu.
- Partnership với trường đào tạo môi giới — offer tool miễn phí cho học viên.
- SEO content: "cách tạo landing page bất động sản", "tool hỗ trợ môi giới".

---

## 9. Metrics & Mục tiêu

| Chỉ số | Tháng 3 | Tháng 12 |
|--------|---------|----------|
| MRR | $200 | $3,000+ |
| Paying customers | 10 | 100+ |
| Listings được tạo | 100 | 2,000+ |
| Trial → Paid conversion | 10% | 15%+ |
| Churn rate tháng | < 10% | < 5% |
| NPS score | > 30 | > 50 |

---

## 10. Rủi ro & Giải pháp

| Rủi ro | Mức độ | Giải pháp |
|--------|--------|-----------|
| Thị trường quá nhỏ | Cao | Mở rộng sang các nước ĐNA (Thailand, Philippines) sau khi traction VN ổn định. |
| Đối thủ lớn copy tính năng | Trung bình | Focus vào tốc độ và UX tối ưu cho môi giới VN — local knowledge là lợi thế. |
| Chi phí OpenAI API tăng | Thấp | Cache mô tả đã sinh, cho phép edit thay vì sinh lại. Giới hạn AI calls theo tier. |
| Người dùng không chịu trả tiền | Cao | Validate willingness-to-pay trước khi build. Free tier đủ hẹp để tạo upgrade pressure. |

---

## 11. Lộ trình phát triển

| Mốc thời gian | Milestone | Nội dung |
|---------------|-----------|----------|
| Tuần 1–2 | Discovery & Setup | Phỏng vấn users, thiết kế wireframe, setup Next.js + Supabase + Stripe, landing page waitlist. |
| Tuần 3–4 | Core Build | Auth, form tạo listing, upload ảnh, generate landing page public URL, QR code. |
| Tuần 5–6 | Polish & Launch | AI mô tả, form lead + email notification, Stripe billing, beta test với 5 môi giới. |
| Tháng 2–3 | Traction | Sửa bugs theo feedback, dashboard analytics, Zalo notification, onboarding tối ưu. |
| Tháng 4–6 | Growth | Custom domain, team plan, affiliate program, SEO content, mở rộng template. |
| Tháng 7–12 | Scale | API public, partnership, localization ĐNA, xem xét mobile app hoặc white-label B2B. |

---

*Tài liệu này được tạo bởi Claude · Phiên bản 1.0 · Chỉ dùng nội bộ*