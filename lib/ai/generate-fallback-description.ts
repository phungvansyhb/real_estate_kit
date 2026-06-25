interface ListingPromptInput {
  title: string
  address: string
  propertyType: string
  type: 'sell' | 'rent'
  area?: number
  bedrooms?: number
  bathrooms?: number
  price?: number
  amenities?: string[]
}

export function generateFallbackDescription(input: ListingPromptInput) {
  const transactionLabel = input.type === 'sell' ? 'mua ở hoặc đầu tư' : 'an cư linh hoạt'
  const amenityText = input.amenities?.filter(Boolean).slice(0, 4).join(', ')

  const areaText = input.area ? `${input.area}m²` : 'diện tích tối ưu'
  const bedroomText = input.bedrooms ? `${input.bedrooms} phòng ngủ` : 'công năng linh hoạt'
  const bathroomText = input.bathrooms ? `${input.bathrooms} phòng tắm` : 'thiết kế tiện nghi'
  const priceText = input.price
    ? `${new Intl.NumberFormat('vi-VN').format(input.price)} VND`
    : 'mức giá hấp dẫn'

  return [
    `${input.title} là lựa chọn nổi bật cho khách hàng đang tìm kiếm ${input.propertyType} tại ${input.address}.`,
    `Bất động sản sở hữu ${areaText}, ${bedroomText} và ${bathroomText}, phù hợp cho nhu cầu ${transactionLabel}.`,
    amenityText
      ? `Điểm cộng lớn của sản phẩm là hệ tiện ích xung quanh như ${amenityText}, giúp trải nghiệm sống hằng ngày trở nên thuận tiện và dễ chịu hơn.`
      : 'Sản phẩm nằm trong khu vực có tiềm năng tăng giá và khả năng khai thác thực tế tốt.',
    `Với ${priceText}, đây là cơ hội phù hợp cho khách hàng muốn chốt giao dịch nhanh nhưng vẫn đảm bảo giá trị sử dụng lâu dài.`,
  ].join(' ')
}
