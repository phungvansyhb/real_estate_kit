import type { Listing } from '@/types/listing'
export const locales = ['vi', 'en'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'vi'
export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale)
}

export const localeLabels: Record<Locale, string> = {
  vi: 'VI',
  en: 'EN',
}

const listingTranslations: Record<
  string,
  {
    en: {
      title: string
      description: string
      amenities: string[]
    }
  }
> = {
  'can-ho-masteri-thao-dien-view-song-sai-gon': {
    en: {
      title: 'Masteri Thao Dien apartment with Saigon River view',
      description:
        'A two-bedroom apartment at Masteri Thao Dien with a generous balcony, polished interiors, and an open river view. Located next to the Metro station for quick access to District 1 and the Thao Dien neighborhood. Ideal for young families or investors targeting one of Ho Chi Minh City’s strongest rental corridors.',
      amenities: ['Metro', 'Swimming pool', 'Gym', 'Vincom mall', '24/7 security'],
    },
  },
  'nha-pho-lakeview-city-3-tang-noi-that-moi': {
    en: {
      title: 'Three-storey Lakeview City townhouse with new interiors',
      description:
        'A beautifully finished townhouse in Lakeview City with a wide front yard, open kitchen, and four bedrooms. The gated community offers strong security, international schools nearby, and fast access to the Long Thanh - Dau Giay expressway. Suitable for end users or buyers looking for a boutique office setup.',
      amenities: ['Park', 'Lakeside promenade', 'Gated compound', 'School nearby'],
    },
  },
  'van-phong-shophouse-thao-dien-mat-tien': {
    en: {
      title: 'Prime-frontage Thao Dien shophouse for showroom or studio',
      description:
        'A corner shophouse in Thao Dien with two frontages, ideal for a showroom, creative studio, or representative office. It offers high ceilings, expansive glass frontage, and consistent passing traffic. A rare commercial asset in one of the city’s most established expat neighborhoods.',
      amenities: ['Street frontage', 'Parking', 'Premium neighborhood', 'Near Metro'],
    },
  },
}

export function getLocalizedListing(listing: Listing, locale: Locale) {
  if (locale === 'vi') {
    return {
      title: listing.title,
      description: listing.description,
      amenities: listing.amenities,
    }
  }

  const translation = listingTranslations[listing.slug]?.en

  return {
    title: translation?.title ?? listing.title,
    description: translation?.description ?? listing.description,
    amenities: translation?.amenities ?? listing.amenities,
  }
}

export const homeContent = {
  vi: {
    nav: {
      features: 'Tính năng',
      reviews: 'Đánh giá',
      pricing: 'Bảng giá',
      dashboard: 'Bảng điều khiển',
      createListing: 'Tạo tin đăng',
    },
    badge: 'Trang riêng cho từng căn • Chia sẻ đẹp • Chốt khách nhanh',
    heroTitle: 'Mỗi căn nhà xứng đáng có một trang giới thiệu thật thuyết phục.',
    heroDescription:
      'Tập hợp hình ảnh, thông tin nổi bật, bản đồ, nút liên hệ và lịch hẹn vào một trang gọn đẹp để gửi khách ngay trên Zalo, Facebook hoặc mã QR ngoài thực địa. Khách hiểu căn nhà nhanh hơn, còn bạn trông chuyên nghiệp hơn ngay từ lần chạm đầu tiên.',
    primaryCta: 'Tạo trang cho căn đầu tiên',
    secondaryCta: 'Xem trang mẫu',
    launchSteps: [
      'Điền thông tin căn nhà, giá bán, diện tích và điểm nổi bật chỉ trong vài phút.',
      'Nhận ngay một trang giới thiệu đẹp mắt, dễ đọc và sẵn sàng gửi khách.',
      'Chia sẻ linh hoạt cho khách Việt hoặc khách quốc tế với phiên bản ngôn ngữ phù hợp.',
    ],
    snapshotTitle: 'Bức tranh kinh doanh trong ngày',
    snapshotDescription:
      'Theo dõi căn nào đang thu hút nhiều lượt xem, khách đến từ đâu và tin đăng nào đang tạo ra nhiều lịch hẹn nhất để ưu tiên tư vấn đúng lúc.',
    featuresLabel: 'Điểm mạnh nổi bật',
    featuresTitle: 'Một trang bán hàng giúp bạn giới thiệu căn nhà chỉn chu hơn và chốt cuộc hẹn nhanh hơn.',
    featuresDescription:
      'Thay vì gửi rời rạc ảnh, mô tả và vị trí qua nhiều tin nhắn, bạn có một trang tập trung mọi thứ khách cần để ra quyết định xem nhà.',
    sampleListingsLabel: 'Tin đăng nổi bật',
    sampleListingsTitle: 'Khám phá những trang giới thiệu được thiết kế theo đúng bối cảnh bán hàng thực tế.',
    openDashboard: 'Xem tổng quan tin đăng',
    reviewsLabel: 'Cảm nhận người dùng',
    reviewsTitle: 'Những phản hồi từ môi giới sau khi gửi khách trang giới thiệu riêng cho từng căn.',
    reviewsDescription:
      'Khi thông tin được trình bày rõ ràng và đẹp mắt, khách dễ tin tưởng hơn và môi giới cũng bớt mất thời gian giải thích lặp lại.',
    pricingLabel: 'Bảng giá',
    pricingTitle: 'Chọn gói phù hợp với số lượng tin đăng và nhịp bán hàng của bạn.',
    pricingLimit: 'Giới hạn',
    recommended: 'Khuyên dùng',
    nextLabel: 'Sẵn sàng bứt tốc',
    nextTitle: 'Đăng một lần, dùng ở mọi điểm chạm với khách hàng.',
    nextDescription:
      'Từ tin nhắn Zalo, bài đăng Facebook đến banner ngoài thực địa, bạn luôn có một đường dẫn chỉn chu để khách xem nhà, đọc thông tin và để lại lịch hẹn ngay.',
    goToDashboard: 'Mở bảng điều khiển',
    continueBuild: 'Tạo tin đăng mới',
    reviews: [
      {
        name: 'Trần Hoàng Phúc',
        role: 'Môi giới căn hộ cao cấp • Quận 2',
        quote:
          'Tôi gửi đường dẫn tin đăng cho khách nước ngoài và họ xem rất dễ. Trang trông chuyên nghiệp hơn hẳn so với gửi album ảnh rời qua Zalo.',
      },
      {
        name: 'Nguyễn Thảo Vy',
        role: 'Trưởng nhóm • Nhà phố khu Đông',
        quote:
          'Mã QR in trên banner giúp khách đi ngang có thể mở trang ngay. Khách để lại thông tin rõ ràng hơn so với nhắn tin thủ công.',
      },
      {
        name: 'Lê Minh Quân',
        role: 'Môi giới cho thuê • Thảo Điền',
        quote:
          'Tôi thích nhất là mỗi căn có một trang giới thiệu riêng, có mô tả dễ đọc và rất hợp để gửi cho khách thuê nước ngoài.',
      },
    ],
    valueProps: [
      {
        title: 'Trang giới thiệu cho từng căn',
        description: 'Mỗi tin đăng có đường dẫn riêng, dễ chia sẻ qua Zalo, Facebook, email hoặc mã QR.',
      },
      {
        title: 'Thông tin SEO theo từng tin',
        description: 'Tiêu đề, mô tả, canonical, Open Graph và sitemap được chuẩn hóa cho trang công khai.',
      },
      {
        title: 'Song ngữ Việt / Anh',
        description: 'Hỗ trợ đường dẫn riêng cho từng ngôn ngữ để phục vụ cả khách nội địa và khách quốc tế.',
      },
      {
        title: 'Biểu mẫu liên hệ rõ ràng',
        description: 'Khách để lại thông tin xem nhà ngay trên trang, giúp môi giới theo sát nhanh hơn.',
      },
    ],
  },
  en: {
    nav: {
      features: 'Features',
      reviews: 'Reviews',
      pricing: 'Pricing',
      dashboard: 'Dashboard',
      createListing: 'Create listing',
    },
    badge: 'One page per property • Share beautifully • Win trust faster',
    heroTitle: 'Every property deserves a page that feels as polished as the home itself.',
    heroDescription:
      'Bring photos, highlights, maps, contact actions, and viewing requests into one elegant page you can share instantly on Zalo, Facebook, or printed QR materials. Clients understand the property faster, and you look more professional from the very first click.',
    primaryCta: 'Create your first property page',
    secondaryCta: 'View a sample page',
    launchSteps: [
      'Add the property details, pricing, floor area, and the key selling points in minutes.',
      'Publish a clean, persuasive page that is ready to send to buyers or tenants right away.',
      'Share the same property in Vietnamese or English depending on who you are talking to.',
    ],
    snapshotTitle: 'Your sales pulse at a glance',
    snapshotDescription:
      'See which properties attract the most attention, where your inquiries come from, and which listings are turning interest into viewing requests.',
    featuresLabel: 'Why agents love it',
    featuresTitle: 'A property page built to help you present listings better and book viewings faster.',
    featuresDescription:
      'Instead of sending scattered photos, copied descriptions, and map pins across multiple messages, you can share one polished page with everything a client needs.',
    sampleListingsLabel: 'Featured listings',
    sampleListingsTitle: 'Explore property pages shaped around real-world selling scenarios.',
    openDashboard: 'View listings overview',
    reviewsLabel: 'Client-facing results',
    reviewsTitle: 'What agents say after sending dedicated property pages to clients.',
    reviewsDescription:
      'When the story of a property is presented clearly and beautifully, clients trust faster and agents spend less time repeating the same details.',
    pricingLabel: 'Pricing',
    pricingTitle: 'Choose the plan that matches your listing volume and selling pace.',
    pricingLimit: 'Limit',
    recommended: 'Recommended',
    nextLabel: 'Ready to move faster',
    nextTitle: 'Create once and use it across every client touchpoint.',
    nextDescription:
      'From chat messages and social posts to outdoor signage, you always have one polished link that helps clients explore the property and request a viewing with confidence.',
    goToDashboard: 'Go to dashboard',
    continueBuild: 'Create a new listing',
    reviews: [
      {
        name: 'Tran Hoang Phuc',
        role: 'Luxury apartment agent • Thu Duc',
        quote:
          'I can now send one clean property page to overseas buyers and it feels far more premium than sending raw photo albums over chat.',
      },
      {
        name: 'Nguyen Thao Vy',
        role: 'Team lead • East Saigon townhouses',
        quote:
          'The QR code printed on outdoor signage works surprisingly well. People scan it and land directly on a page with the full context.',
      },
      {
        name: 'Le Minh Quan',
        role: 'Rental broker • Thao Dien',
        quote:
          'The bilingual page is especially useful for expat renters. The listing looks sharper and saves me time explaining the same details repeatedly.',
      },
    ],
    valueProps: [
      {
        title: 'One landing page per property',
        description: 'Each listing gets a dedicated public URL that is easy to share across chat, social, email, and QR.',
      },
      {
        title: 'SEO metadata per listing',
        description: 'Titles, descriptions, canonicals, Open Graph data, and sitemap entries are structured for public pages.',
      },
      {
        title: 'Vietnamese and English routes',
        description: 'Serve both domestic and international audiences with dedicated localized paths.',
      },
      {
        title: 'Clear lead capture flow',
        description: 'Visitors can leave their contact details directly on the page so agents can follow up faster.',
      },
    ],
  },
} as const

export const listingPageContent = {
  vi: {
    publicLabel: 'Thông tin bất động sản',
    viewDashboard: 'Bảng điều khiển',
    createListing: 'Tạo tin đăng',
    propertyDescription: 'Mô tả bất động sản',
    propertyDescriptionHint: 'Phần tóm tắt giúp khách nắm nhanh những điểm đáng quan tâm trước khi hẹn lịch xem nhà.',
    amenities: 'Tiện ích nổi bật',
    traffic: 'Nguồn khách quan tâm',
    trafficHint: 'Cho bạn góc nhìn nhanh về các kênh đang kéo khách đến trang của căn này.',
    agentInfo: 'Thông tin môi giới',
    agentHint: 'Khách có thể gọi điện, nhắn Zalo hoặc lưu mã QR để xem lại thông tin bất cứ lúc nào.',
    callNow: 'Gọi ngay',
    chatZalo: 'Nhắn Zalo',
    downloadQr: 'Tải mã QR',
    leadTitle: 'Đặt lịch xem nhà',
    leadDescription: 'Để lại thông tin để môi giới chủ động liên hệ và sắp xếp lịch xem phù hợp cho bạn.',
    fullName: 'Họ và tên',
    phone: 'Số điện thoại',
    preferredTime: 'Khung giờ mong muốn',
    note: 'Ghi chú thêm',
    submit: 'Gửi yêu cầu xem nhà',
    submitting: 'Đang gửi...',
    success: 'Yêu cầu xem nhà đã được ghi nhận. Môi giới sẽ sớm liên hệ để xác nhận lịch hẹn.',
    genericError: 'Có lỗi kết nối. Vui lòng thử lại sau.',
    metrics: {
      area: 'Diện tích',
      bedrooms: 'Phòng ngủ',
      bathrooms: 'Phòng tắm',
      views: 'Lượt xem',
    },
  },
  en: {
    publicLabel: 'Property details',
    viewDashboard: 'Dashboard',
    createListing: 'Create listing',
    propertyDescription: 'Property overview',
    propertyDescriptionHint: 'A concise overview to help buyers or tenants quickly understand what makes this property worth a visit.',
    amenities: 'Key amenities',
    traffic: 'Interest sources',
    trafficHint: 'A quick view of the channels bringing attention to this property page.',
    agentInfo: 'Agent information',
    agentHint: 'Clients can call, message on Zalo, or save the QR code to revisit the property details anytime.',
    callNow: 'Call now',
    chatZalo: 'Chat on Zalo',
    downloadQr: 'Download QR code',
    leadTitle: 'Book a property viewing',
    leadDescription: 'Leave your details and the agent can quickly follow up to arrange a suitable viewing time.',
    fullName: 'Full name',
    phone: 'Phone number',
    preferredTime: 'Preferred time',
    note: 'Additional notes',
    submit: 'Send viewing request',
    submitting: 'Sending...',
    success: 'Your viewing request has been received. The agent will follow up shortly to confirm the appointment.',
    genericError: 'A network error occurred. Please try again later.',
    metrics: {
      area: 'Floor area',
      bedrooms: 'Bedrooms',
      bathrooms: 'Bathrooms',
      views: 'Views',
    },
  },
} as const
