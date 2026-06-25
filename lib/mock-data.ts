import type { Listing, PricingPlan } from '@/types/listing'

const agent = {
  id: 'agent-1',
  name: 'Nguyễn Minh An',
  phone: '0901234567',
  email: 'minhan@listingkit.vn',
  company: 'An Gia Boutique Realty',
  avatarUrl:
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
  plan: 'starter' as const,
}

export const sampleListings: Listing[] = [
  {
    id: 'listing-1',
    slug: 'can-ho-masteri-thao-dien-view-song-sai-gon',
    title: 'Căn hộ Masteri Thảo Điền view sông Sài Gòn',
    description:
      'Căn hộ 2 phòng ngủ tại Masteri Thảo Điền với ban công rộng, nội thất hoàn thiện chỉn chu và tầm nhìn thoáng ra sông Sài Gòn. Vị trí ngay ga Metro, kết nối nhanh Quận 1 và khu Thảo Điền. Phù hợp cho gia đình trẻ hoặc khách hàng muốn đầu tư cho thuê tại khu vực có nhu cầu cao.',
    price: 5400000000,
    area: 78,
    bedrooms: 2,
    bathrooms: 2,
    address: '159 Xa lộ Hà Nội, Phường Thảo Điền',
    district: 'Thủ Đức',
    city: 'TP. Hồ Chí Minh',
    type: 'sell',
    propertyType: 'apartment',
    amenities: ['Metro', 'Hồ bơi', 'Gym', 'TTTM Vincom', 'Bảo vệ 24/7'],
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1600&q=80',
    ],
    status: 'active',
    viewCount: 1284,
    leadsCount: 18,
    sourceBreakdown: [
      { label: 'Zalo', value: 44 },
      { label: 'Facebook', value: 29 },
      { label: 'QR', value: 18 },
      { label: 'Direct', value: 9 },
    ],
    featured: true,
    createdAt: '2026-06-21T10:00:00.000Z',
    agent,
  },
  {
    id: 'listing-2',
    slug: 'nha-pho-lakeview-city-3-tang-noi-that-moi',
    title: 'Nhà phố Lakeview City 3 tầng nội thất mới',
    description:
      'Nhà phố hoàn thiện đẹp tại Lakeview City, thiết kế hiện đại với sân trước rộng, khu bếp mở và 4 phòng ngủ. Khu compound an ninh, gần trường quốc tế và cao tốc Long Thành - Dầu Giây. Thích hợp để ở lâu dài hoặc khai thác văn phòng boutique.',
    price: 12900000000,
    area: 120,
    bedrooms: 4,
    bathrooms: 4,
    address: 'Đường Song Hành, Khu đô thị Lakeview City',
    district: 'Thủ Đức',
    city: 'TP. Hồ Chí Minh',
    type: 'sell',
    propertyType: 'house',
    amenities: ['Công viên', 'Hồ cảnh quan', 'Khu compound', 'Trường học'],
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80',
    ],
    status: 'active',
    viewCount: 804,
    leadsCount: 11,
    sourceBreakdown: [
      { label: 'Facebook', value: 38 },
      { label: 'QR', value: 24 },
      { label: 'Zalo', value: 20 },
      { label: 'Direct', value: 7 },
    ],
    featured: false,
    createdAt: '2026-06-22T14:30:00.000Z',
    agent,
  },
  {
    id: 'listing-3',
    slug: 'van-phong-shophouse-thao-dien-mat-tien',
    title: 'Shophouse Thảo Điền mặt tiền phù hợp showroom',
    description:
      'Shophouse góc hai mặt tiền tại khu Thảo Điền, phù hợp mở showroom, studio hoặc văn phòng đại diện. Không gian trần cao, mặt kính rộng và lưu lượng khách qua lại ổn định. Tài sản hiếm trong khu vực, dễ khai thác thương mại.',
    price: 52000000,
    area: 95,
    bedrooms: 1,
    bathrooms: 2,
    address: 'Nguyễn Văn Hưởng, Phường Thảo Điền',
    district: 'Quận 2 cũ',
    city: 'TP. Hồ Chí Minh',
    type: 'rent',
    propertyType: 'shophouse',
    amenities: ['Mặt tiền', 'Bãi đỗ xe', 'Khu dân cư cao cấp', 'Gần Metro'],
    images: [
      'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1448630360428-65456885c650?auto=format&fit=crop&w=1600&q=80',
    ],
    status: 'draft',
    viewCount: 216,
    leadsCount: 3,
    sourceBreakdown: [
      { label: 'Zalo', value: 12 },
      { label: 'QR', value: 4 },
      { label: 'Facebook', value: 3 },
    ],
    featured: false,
    createdAt: '2026-06-23T09:15:00.000Z',
    agent,
  },
]

export const pricingPlans: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free',
    priceLabel: '$0',
    description: 'Dành cho môi giới muốn thử nhanh trước khi triển khai thật.',
    listingLimit: '3 listings',
    features: [
      { name: 'Landing page public', included: true },
      { name: 'QR code cho từng listing', included: true },
      { name: 'Lead form cơ bản', included: true },
      { name: 'AI mô tả', included: false },
      { name: 'Analytics cơ bản', included: false },
    ],
  },
  {
    id: 'starter',
    name: 'Starter',
    priceLabel: '$19 / tháng',
    description: 'Gói chính cho môi giới cá nhân muốn ra listing chuyên nghiệp mỗi ngày.',
    listingLimit: '20 listings',
    highlighted: true,
    features: [
      { name: 'Không watermark', included: true },
      { name: 'AI mô tả tiếng Việt', included: true },
      { name: 'Analytics lượt xem và nguồn traffic', included: true },
      { name: 'Email thông báo lead', included: true },
      { name: 'Custom domain', included: false },
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    priceLabel: '$49 / tháng',
    description: 'Cho team nhỏ cần scale nhiều listing và đồng bộ thương hiệu.',
    listingLimit: 'Không giới hạn',
    features: [
      { name: 'Unlimited listings', included: true },
      { name: 'Team 5 người', included: true },
      { name: 'Custom domain', included: true },
      { name: 'Priority support', included: true },
      { name: 'Analytics nâng cao', included: true },
    ],
  },
]

export const dashboardStats = [
  {
    label: 'Active listings',
    value: '12',
    description: '3 listings mới được publish trong 7 ngày qua',
  },
  {
    label: 'Tổng lượt xem',
    value: '3.4K',
    description: 'Tăng 18% so với tuần trước',
  },
  {
    label: 'Leads mới',
    value: '29',
    description: '6 lead đến từ QR ngoài thực địa',
  },
  {
    label: 'Conversion demo',
    value: '11.8%',
    description: 'Tỷ lệ view → form submit của tuần này',
  },
]

export function getListingBySlug(slug: string) {
  return sampleListings.find((listing) => listing.slug === slug)
}

export function getFeaturedListing() {
  return sampleListings.find((listing) => listing.featured) ?? sampleListings[0]
}
