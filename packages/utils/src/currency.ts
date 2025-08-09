export const SAR_CURRENCY = 'SAR' as const
export const SAR_DECIMALS = 2

export const formatSAR = (amountCents: number): string => {
  const amount = amountCents / 100
  return new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: 'SAR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export const parseSAR = (amount: string): number => {
  const cleanAmount = amount.replace(/[^\d.,]/g, '')
  const numericAmount = parseFloat(cleanAmount.replace(',', '.'))
  return Math.round(numericAmount * 100)
}

export const roundSAR = (amountCents: number): number => {
  return Math.round(amountCents)
}

export const calculateDiscount = (
  originalPriceCents: number,
  discountPercent: number
): number => {
  const discountAmount = (originalPriceCents * discountPercent) / 100
  return roundSAR(discountAmount)
}

export const applyDiscount = (
  originalPriceCents: number,
  discountPercent: number
): number => {
  const discountAmount = calculateDiscount(originalPriceCents, discountPercent)
  return originalPriceCents - discountAmount
}

