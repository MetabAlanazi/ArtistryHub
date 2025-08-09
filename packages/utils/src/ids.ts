import { nanoid } from 'nanoid'

export const generateId = (): string => {
  return nanoid()
}

export const generateSKU = (type: 'PNT' | 'PST' | 'FRN', year: number, sequence: number): string => {
  return `${type}-${year}-${String(sequence).padStart(4, '0')}`
}

export const generateVariantSKU = (baseSKU: string, variantNumber: number): string => {
  return `${baseSKU}-V${String(variantNumber).padStart(2, '0')}`
}

export const generateTrackingNumber = (): string => {
  return `TRK${nanoid(8).toUpperCase()}`
}

export const generateOrderNumber = (): string => {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const random = nanoid(6).toUpperCase()
  return `ORD-${year}${month}${day}-${random}`
}

export const generateIdempotencyKey = (): string => {
  return `idemp_${nanoid(16)}`
}

export const validateIdempotencyKey = (key: string): boolean => {
  return /^idemp_[a-zA-Z0-9]{16}$/.test(key)
}

