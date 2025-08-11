import { authenticator } from 'otplib'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSessionStrict, requireRecentAuth } from './helpers'

export interface TwoFactorSetup {
  secret: string
  qrCode: string
  backupCodes: string[]
}

export interface TwoFactorVerify {
  code: string
  remember?: boolean
}

export class TwoFactorService {
  static generateSecret(email: string): string {
    return authenticator.generateSecret()
  }

  static generateQRCode(email: string, secret: string): string {
    const otpauth = authenticator.keyuri(email, 'ArtistryHub', secret)
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(otpauth)}`
  }

  static generateBackupCodes(): string[] {
    const codes: string[] = []
    for (let i = 0; i < 8; i++) {
      codes.push(Math.random().toString(36).substring(2, 8).toUpperCase())
    }
    return codes
  }

  static verifyCode(secret: string, code: string): boolean {
    try {
      return authenticator.verify({ token: code, secret })
    } catch {
      return false
    }
  }

  static async setupTwoFactor(email: string): Promise<TwoFactorSetup> {
    const secret = this.generateSecret(email)
    const qrCode = this.generateQRCode(email, secret)
    const backupCodes = this.generateBackupCodes()
    
    return { secret, qrCode, backupCodes }
  }

  static async verifyTwoFactorSetup(
    secret: string, 
    code: string, 
    backupCodes: string[]
  ): Promise<boolean> {
    if (this.verifyCode(secret, code)) {
      return true
    }
    
    // Check backup codes
    return backupCodes.includes(code)
  }
}

// Middleware for 2FA verification
export const requireTwoFactor = (req: NextRequest) => {
  return async () => {
    const session = await getServerSessionStrict(req)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user has 2FA enabled
    // This would typically check the database for TwoFactorSecret
    // For now, we'll assume it's required for admin actions
    
    return session
  }
}

// Re-authentication endpoint handler
export const handleReAuth = async (req: NextRequest) => {
  try {
    const body = await req.json() as { password?: string; twoFactorCode?: string }
    const { password, twoFactorCode } = body

    if (!password) {
      return NextResponse.json({ error: 'Password required' }, { status: 400 })
    }

    // Verify password and 2FA if enabled
    // This would typically:
    // 1. Verify password against stored hash
    // 2. Verify 2FA code if enabled
    // 3. Update session with new reauthAt timestamp
    
    // For now, return success (implement actual verification)
    return NextResponse.json({ 
      success: true,
      message: 'Re-authentication successful'
    })
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}

// Middleware for requiring recent re-authentication
export const requireRecentReAuth = (maxAgeMinutes: number = 10) => {
  return requireRecentAuth(maxAgeMinutes)
}

// Utility to check if re-authentication is needed
export const isReAuthRequired = (session: any, maxAgeMinutes: number = 10): boolean => {
  if (!session?.reauthAt) return true
  
  const now = Date.now()
  const maxAge = maxAgeMinutes * 60 * 1000
  
  return (now - session.reauthAt) > maxAge
}
