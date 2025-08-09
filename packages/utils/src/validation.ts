import { z } from 'zod'

export const emailSchema = z.string().email('Invalid email address')

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase, and number')

export const phoneSchema = z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number')

export const sarAmountSchema = z.number().positive('Amount must be positive')

export const skuSchema = z.string().regex(/^[A-Z]{3}-\d{4}-\d{4}$/, 'Invalid SKU format')

export const trackingNumberSchema = z.string().regex(/^TRK[A-Z0-9]{8}$/, 'Invalid tracking number')

export const orderNumberSchema = z.string().regex(/^ORD-\d{8}-[A-Z0-9]{6}$/, 'Invalid order number')

export const validateSAR = (amount: number): boolean => {
  return amount > 0 && Number.isInteger(amount)
}

export const validateEmail = (email: string): boolean => {
  return emailSchema.safeParse(email).success
}

export const validatePhone = (phone: string): boolean => {
  return phoneSchema.safeParse(phone).success
}

export const validateSKU = (sku: string): boolean => {
  return skuSchema.safeParse(sku).success
}

export const validateTrackingNumber = (tracking: string): boolean => {
  return trackingNumberSchema.safeParse(tracking).success
}

export const validateOrderNumber = (orderNumber: string): boolean => {
  return orderNumberSchema.safeParse(orderNumber).success
}

