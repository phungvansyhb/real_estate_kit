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
  const transactionLabel = input.type === 'sell' ? 'mua ở hoặc đầu tư' : 'khai thác hoặc an cư linh hoạt'
  const amenityText = input.amenities?.filter(Boolean).slice(0, 4).join(', ')

  const areaText = input.area ? `${input.area}m²` : 'diện tích phù hợp'
  const roomSummary =
    typeof input.bedrooms === 'number' || typeof input.bathrooms === 'number'
      ? [
          typeof input.bedrooms === 'number' ? `${input.bedrooms} phòng ngủ` : null,
          typeof input.bathrooms === 'number' ? `${input.bathrooms} phòng tắm` : null,
        ]
          .filter(Boolean)
          .join(', ')
      : null
  const secondSentence = roomSummary
    ? `Bất động sản sở hữu ${areaText}, ${roomSummary}, phù hợp cho nhu cầu ${transactionLabel}.`
    : `Bất động sản có ${areaText}, phù hợp cho khách hàng đang tìm kiếm tài sản phục vụ nhu cầu ${transactionLabel}.`
  const priceText = input.price
    ? `${new Intl.NumberFormat('vi-VN').format(input.price)} VND`
    : 'mức giá hấp dẫn'

  return [
    `${input.title} là lựa chọn nổi bật cho khách hàng đang tìm kiếm ${input.propertyType} tại ${input.address}.`,
    secondSentence,
    amenityText
      ? `Điểm cộng lớn của sản phẩm là những lợi thế như ${amenityText}, giúp tăng tính khai thác thực tế và sức hút khi giới thiệu cho khách.`
      : 'Sản phẩm nằm trong khu vực có tiềm năng tăng giá và khả năng khai thác thực tế tốt.',
    `Với ${priceText}, đây là cơ hội phù hợp cho khách hàng muốn chốt giao dịch nhanh nhưng vẫn đảm bảo giá trị sử dụng lâu dài.`,
  ].join(' ')
}
