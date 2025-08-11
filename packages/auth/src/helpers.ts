import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { baseAuthOptions } from './authOptions'
import type { UserRole } from './types'

export const getCurrentUser = async () => {
  // For Next.js server components, we can call getServerSession without a request
  try {
    const session = await getServerSession(baseAuthOptions)
    if (!session?.user?.id || !session?.user?.role) {
      return null
    }
    return session.user
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

export const getServerSessionForAPI = async () => {
  // For Next.js API routes, we can call getServerSession without a request
  try {
    const session = await getServerSession(baseAuthOptions)
    if (!session?.user?.id || !session?.user?.role) {
      throw new Error('Unauthorized: No valid session')
    }
    return session
  } catch (error) {
    console.error('Error getting server session for API:', error)
    throw new Error('Unauthorized: No valid session')
  }
}

export const getServerSessionStrict = async (req: NextRequest) => {
  // Note: getServerSession doesn't work directly with NextRequest in middleware
  // This is a simplified version for demonstration
  // In practice, you'd need to extract headers and create a proper request object
  const session = await getServerSession(baseAuthOptions)
  if (!session?.user?.id || !session?.user?.role) {
    return null
  }
  return session
}

export const requireRole = (roles: UserRole[]) => {
  return async (req: NextRequest) => {
    const session = await getServerSessionStrict(req)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    if (!roles.includes(session.user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    
    return session
  }
}

export const withRole = <T extends any[]>(
  roles: UserRole[], 
  handler: (req: NextRequest, session: any, ...args: T) => Promise<NextResponse>
) => {
  return async (req: NextRequest, ...args: T) => {
    const session = await getServerSessionStrict(req)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    if (!roles.includes(session.user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    
    return handler(req, session, ...args)
  }
}

export const requireRecentAuth = (maxAgeMinutes: number = 10) => {
  return async (req: NextRequest) => {
    const session = await getServerSessionStrict(req)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const reauthAt = session.reauthAt || 0
    const now = Date.now()
    const maxAge = maxAgeMinutes * 60 * 1000
    
    if (now - reauthAt > maxAge) {
      return NextResponse.json({ 
        error: 'Re-authentication required',
        code: 'REAUTH_REQUIRED'
      }, { status: 403 })
    }
    
    return session
  }
}

export const isAuthenticated = async (req: NextRequest) => {
  const session = await getServerSessionStrict(req)
  return !!session
}

export const getUserRole = async (req: NextRequest): Promise<UserRole | null> => {
  const session = await getServerSessionStrict(req)
  return session?.user?.role || null
}
