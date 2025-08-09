import { z } from 'zod'
import { Role } from '@artistry-hub/db'

// Common envelope
export type Api<T> = { ok: true; data: T } | { ok: false; error: { code: string; message: string; issues?: any } }

// Auth flows
export const RegisterDto = z.object({
  email: z.string().email(),
  password: z.string().min(8).regex(/\d/).regex(/[a-zA-Z]/),
  name: z.string().optional(),
})

export const LoginDto = z.object({
  email: z.string().email(),
  password: z.string(),
  otp: z.string().optional(),
})

export const VerifyEmailDto = z.object({
  token: z.string(),
})

export const RequestResetDto = z.object({
  email: z.string().email(),
})

export const ResetPasswordDto = z.object({
  token: z.string(),
  newPassword: z.string().min(8).regex(/\d/).regex(/[a-zA-Z]/),
})

// Admin user management
export const ChangeRoleDto = z.object({
  userId: z.string(),
  role: z.enum(['customer', 'artist', 'admin', 'operator', 'service']),
})

export const ToggleStatusDto = z.object({
  userId: z.string(),
  status: z.enum(['ACTIVE', 'SUSPENDED']),
})

export const InviteDto = z.object({
  email: z.string().email(),
  role: z.enum(['artist', 'operator', 'service']),
  name: z.string().optional(),
})

// 2FA
export const EnrollTOTPDto = z.object({})

export const VerifyTOTPDto = z.object({
  code: z.string().length(6),
})

export const DisableTOTPDto = z.object({
  code: z.string().length(6),
})

// Service tokens (admin only for service users)
export const CreateServiceTokenDto = z.object({
  userId: z.string(),
  name: z.string(),
  scopes: z.array(z.string()),
})

export const RevokeServiceTokenDto = z.object({
  tokenId: z.string(),
})

// Response DTOs
export const UserDto = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string().nullable(),
  role: z.nativeEnum(Role),
  status: z.string(),
  emailVerified: z.date().nullable(),
  twoFAEnabled: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const ServiceTokenDto = z.object({
  id: z.string(),
  name: z.string(),
  scopes: z.string(),
  active: z.boolean(),
  lastUsedAt: z.date().nullable(),
  createdAt: z.date(),
})

export const SessionDto = z.object({
  id: z.string(),
  expires: z.date(),
})

export const AuditLogDto = z.object({
  id: z.string(),
  actorUserId: z.string().nullable(),
  action: z.string(),
  entity: z.string(),
  entityId: z.string(),
  meta: z.any().nullable(),
  createdAt: z.date(),
})

// Export types
export type RegisterDtoType = z.infer<typeof RegisterDto>
export type LoginDtoType = z.infer<typeof LoginDto>
export type VerifyEmailDtoType = z.infer<typeof VerifyEmailDto>
export type RequestResetDtoType = z.infer<typeof RequestResetDto>
export type ResetPasswordDtoType = z.infer<typeof ResetPasswordDto>
export type ChangeRoleDtoType = z.infer<typeof ChangeRoleDto>
export type ToggleStatusDtoType = z.infer<typeof ToggleStatusDto>
export type InviteDtoType = z.infer<typeof InviteDto>
export type EnrollTOTPDtoType = z.infer<typeof EnrollTOTPDto>
export type VerifyTOTPDtoType = z.infer<typeof VerifyTOTPDto>
export type DisableTOTPDtoType = z.infer<typeof DisableTOTPDto>
export type CreateServiceTokenDtoType = z.infer<typeof CreateServiceTokenDto>
export type RevokeServiceTokenDtoType = z.infer<typeof RevokeServiceTokenDto>
export type UserDtoType = z.infer<typeof UserDto>
export type ServiceTokenDtoType = z.infer<typeof ServiceTokenDto>
export type SessionDtoType = z.infer<typeof SessionDto>
export type AuditLogDtoType = z.infer<typeof AuditLogDto>
