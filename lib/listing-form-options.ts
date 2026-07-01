import type { ListingIntent, PropertyType } from '@/types/listing'

export interface PropertyTypeOption {
  value: PropertyType
  label: string
  description: string
}

export interface ListingIntentOption {
  value: ListingIntent
  label: string
  description: string
}

export interface PropertyTypeConfig {
  subtypeLabel: string
  subtypeOptions: string[]
  presetAmenities: string[]
  supportsRooms: boolean
}

export const propertyTypeOptions: PropertyTypeOption[] = [
  {
    value: 'apartment',
    label: 'Chung cư / căn hộ',
    description: 'Phù hợp môi giới căn hộ mua ở hoặc đầu tư cho thuê.',
  },
  {
    value: 'house',
    label: 'Nhà',
    description: 'Dùng cho nhà phố, nhà hẻm, nhà mặt tiền hoặc nhà riêng.',
  },
  {
    value: 'land',
    label: 'Đất',
    description: 'Dùng cho đất thổ cư, đất nền dự án, đất vườn hoặc lô góc.',
  },
  {
    value: 'villa',
    label: 'Biệt thự',
    description: 'Phù hợp tài sản cao cấp, compound hoặc nghỉ dưỡng.',
  },
  {
    value: 'shophouse',
    label: 'Shophouse',
    description: 'Dùng cho tài sản vừa ở vừa kinh doanh hoặc khai thác thương mại.',
  },
]

export const listingIntentOptions: ListingIntentOption[] = [
  {
    value: 'sell',
    label: 'Bán',
    description: 'Phù hợp nhu cầu chốt giao dịch mua bán.',
  },
  {
    value: 'rent',
    label: 'Cho thuê',
    description: 'Phù hợp nhu cầu tìm khách thuê ở hoặc kinh doanh.',
  },
]

export const propertyTypeConfigs: Record<PropertyType, PropertyTypeConfig> = {
  apartment: {
    subtypeLabel: 'Phân khúc căn hộ',
    subtypeOptions: ['Căn hộ chung cư', 'Căn hộ cao cấp', 'Duplex', 'Penthouse'],
    presetAmenities: [
      'Gần Metro',
      'Hồ bơi',
      'Phòng gym',
      'Ban công thoáng',
      'Nội thất đầy đủ',
      'Bảo vệ 24/7',
      'Gần trung tâm thương mại',
      'Khu dân cư văn minh',
    ],
    supportsRooms: true,
  },
  house: {
    subtypeLabel: 'Loại nhà',
    subtypeOptions: ['Nhà phố', 'Nhà hẻm xe hơi', 'Nhà mặt tiền', 'Nhà riêng'],
    presetAmenities: [
      'Gần chợ',
      'Gần trường học',
      'Khu dân cư hiện hữu',
      'Ô tô vào tận nơi',
      'Sân để xe',
      'Pháp lý rõ ràng',
      'Khu an ninh',
      'Thuận tiện kinh doanh',
    ],
    supportsRooms: true,
  },
  land: {
    subtypeLabel: 'Loại đất',
    subtypeOptions: ['Đất thổ cư', 'Đất nền dự án', 'Đất mặt tiền', 'Đất vườn'],
    presetAmenities: [
      'Thổ cư 100%',
      'Gần chợ',
      'Gần trường học',
      'Đường ô tô',
      'Nở hậu',
      'Pháp lý rõ ràng',
      'Gần khu dân cư',
      'Tiềm năng tăng giá',
    ],
    supportsRooms: false,
  },
  villa: {
    subtypeLabel: 'Loại biệt thự',
    subtypeOptions: ['Biệt thự song lập', 'Biệt thự đơn lập', 'Biệt thự sân vườn', 'Biệt thự nghỉ dưỡng'],
    presetAmenities: [
      'Hồ bơi riêng',
      'Sân vườn rộng',
      'Compound an ninh',
      'Gần trường quốc tế',
      'Gara ô tô',
      'Nội thất cao cấp',
      'Khu yên tĩnh',
      'Phù hợp nghỉ dưỡng',
    ],
    supportsRooms: true,
  },
  shophouse: {
    subtypeLabel: 'Mô hình khai thác',
    subtypeOptions: ['Shophouse mặt tiền', 'Shophouse khối đế', 'Nhà phố thương mại', 'Shophouse góc'],
    presetAmenities: [
      'Mặt tiền lớn',
      'Lưu lượng khách ổn định',
      'Chỗ đỗ xe thuận tiện',
      'Khu thương mại sầm uất',
      'Có thể ở kết hợp kinh doanh',
      'Gần khu dân cư đông đúc',
      'Hợp đồng thuê tốt',
      'Dễ khai thác showroom',
    ],
    supportsRooms: true,
  },
}

export function getPropertyTypeConfig(propertyType: PropertyType) {
  return propertyTypeConfigs[propertyType]
}

export function getPropertyTypeOption(propertyType: PropertyType) {
  return propertyTypeOptions.find((option) => option.value === propertyType) ?? propertyTypeOptions[0]
}
