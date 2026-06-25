---
name: shadcn-ui
description: >
  Khi cần tạo hoặc chỉnh sửa bất kỳ UI component nào trong dự án — button, form,
  dialog, card, table, sidebar, input, badge, toast, hay bất kỳ element giao diện
  nào. LUÔN dùng shadcn/ui làm nguồn đầu tiên. Không tự viết UI component từ đầu
  nếu shadcn đã có sẵn.
---

# Shadcn/ui — UI System cho ListingKit

## Nguyên tắc bất di bất dịch

1. **Không tự viết UI từ đầu** nếu shadcn đã có component tương đương.
2. **Không cài thêm thư viện UI khác** (MUI, Ant Design, Chakra…) — gây xung đột style.
3. **Không override Tailwind bằng CSS module** — chỉnh sửa trực tiếp file component trong `components/ui/`.
4. Import từ `@/components/ui/` — không import từ package `@radix-ui/*` trực tiếp.

---

## Cài component mới

```bash
# Cú pháp chuẩn — thêm 1 hoặc nhiều component
npx shadcn@latest add button
npx shadcn@latest add card dialog form input badge
```

Component được copy vào `src/components/ui/` — bạn sở hữu code, có thể sửa trực tiếp.

---

## Các component đã cài cho ListingKit

| Component | Dùng ở đâu |
|-----------|------------|
| `button` | Mọi CTA, form submit, action |
| `card` | Listing card, stats card, plan card |
| `form` + `input` + `label` | Mọi form nhập liệu |
| `dialog` + `sheet` | Modal xác nhận, slide-in panel mobile |
| `badge` | Trạng thái listing (Đang bán / Đã bán / Nháp) |
| `toast` (Sonner) | Thông báo thành công / lỗi |
| `table` | Bảng leads, bảng listings |
| `sidebar` | Navigation dashboard |
| `avatar` | Avatar môi giới |
| `separator` | Divider trong layout |
| `skeleton` | Loading state |
| `dropdown-menu` | Menu hành động (Edit, Delete, Share) |
| `tabs` | Phân tab trong trang chi tiết |

---

## Patterns chuẩn

### Button — đúng variant cho đúng ngữ cảnh

```tsx
import { Button } from '@/components/ui/button'

// Primary action (Tạo listing, Lưu, Submit)
<Button>Tạo listing mới</Button>

// Secondary / hủy
<Button variant="outline">Hủy</Button>

// Nguy hiểm (Xóa)
<Button variant="destructive">Xóa listing</Button>

// Chỉ icon, không text
<Button variant="ghost" size="icon">
  <Share2 className="h-4 w-4" />
</Button>

// Loading state
<Button disabled={isPending}>
  {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
  Đang lưu...
</Button>
```

### Form với react-hook-form + Zod

```tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const LeadFormSchema = z.object({
  name: z.string().min(2, 'Tên phải có ít nhất 2 ký tự'),
  phone: z.string().regex(/^[0-9]{9,11}$/, 'Số điện thoại không hợp lệ'),
  note: z.string().max(500).optional(),
})

type LeadFormValues = z.infer<typeof LeadFormSchema>

export function LeadForm({ listingId }: { listingId: string }) {
  const form = useForm<LeadFormValues>({
    resolver: zodResolver(LeadFormSchema),
    defaultValues: { name: '', phone: '', note: '' },
  })

  async function onSubmit(values: LeadFormValues) {
    // gọi API / server action
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Họ tên</FormLabel>
              <FormControl>
                <Input placeholder="Nguyễn Văn A" {...field} />
              </FormControl>
              <FormMessage />  {/* Tự hiển thị lỗi Zod */}
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Đặt lịch xem nhà
        </Button>
      </form>
    </Form>
  )
}
```

### Card — listing card

```tsx
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export function ListingCard({ listing }: { listing: Listing }) {
  const statusMap = {
    active:  { label: 'Đang bán',   variant: 'default'     },
    sold:    { label: 'Đã bán',     variant: 'secondary'   },
    rented:  { label: 'Đã cho thuê',variant: 'secondary'   },
    draft:   { label: 'Nháp',       variant: 'outline'     },
  } as const

  const status = statusMap[listing.status]

  return (
    <Card className="overflow-hidden">
      <div className="aspect-video relative bg-muted">
        {listing.images[0] && (
          <img src={listing.images[0]} alt={listing.title}
               className="object-cover w-full h-full" />
        )}
        <Badge variant={status.variant} className="absolute top-2 right-2">
          {status.label}
        </Badge>
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="line-clamp-1 text-base">{listing.title}</CardTitle>
        <p className="text-sm text-muted-foreground">{listing.address}</p>
      </CardHeader>
      <CardContent className="pb-3">
        <p className="font-semibold text-lg">
          {new Intl.NumberFormat('vi-VN').format(listing.price ?? 0)} VND
        </p>
        <p className="text-sm text-muted-foreground">
          {listing.area} m² · {listing.bedrooms} PN · {listing.bathrooms} WC
        </p>
      </CardContent>
      <CardFooter className="gap-2">
        <Button variant="outline" size="sm" className="flex-1" asChild>
          <a href={`/l/${listing.slug}`} target="_blank">Xem trang</a>
        </Button>
        <Button variant="ghost" size="icon">
          <QrCode className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
```

### Dialog — modal xác nhận xóa

```tsx
import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog'

export function DeleteListingDialog({ listingId, title }: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">Xóa</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Xóa listing?</DialogTitle>
          <DialogDescription>
            Thao tác này không thể hoàn tác. Listing "{title}" sẽ bị xóa vĩnh viễn.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline">Hủy</Button>
          <Button variant="destructive" onClick={() => deleteListing(listingId)}>
            Xóa
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
```

### Toast với Sonner

```tsx
// layout.tsx — thêm 1 lần duy nhất
import { Toaster } from '@/components/ui/sonner'
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  )
}

// Dùng trong component
import { toast } from 'sonner'

toast.success('Tạo listing thành công!')
toast.error('Có lỗi xảy ra, thử lại sau.')
toast.loading('Đang tải lên ảnh...')
```

### Skeleton — loading state

```tsx
import { Skeleton } from '@/components/ui/skeleton'

export function ListingCardSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="aspect-video w-full rounded-lg" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  )
}
```

---

## Theme tokens (globals.css)

```css
/* Màu chủ đạo của ListingKit — chỉnh ở đây, áp dụng toàn project */
:root {
  --primary: 221 83% 53%;          /* Blue #2563EB */
  --primary-foreground: 0 0% 100%;
  --radius: 0.5rem;
}
```

---

## Kiến trúc 3 tầng (theo best practice 2026)

```
components/
├── ui/           ← Shadcn gốc — KHÔNG sửa trừ khi thật cần thiết
├── primitives/   ← Wrap nhẹ với preset của ListingKit
│   ├── app-button.tsx      (Button với className mặc định project)
│   └── listing-badge.tsx   (Badge với mapping status cố định)
└── features/     ← Composition business logic
    ├── listing-card.tsx
    ├── lead-form.tsx
    └── qr-download-button.tsx
```

> **Quy tắc nâng cao:** Nếu dùng cùng 1 shadcn component với cùng className ở 3+ nơi → tạo `primitives/` wrapper thay vì copy-paste.
