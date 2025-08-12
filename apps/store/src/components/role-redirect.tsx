'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface RoleRedirectProps {
  allowedRoles?: string[]
  redirectTo?: string
  children: React.ReactNode
}

export default function RoleRedirect({ 
  allowedRoles, 
  redirectTo, 
  children 
}: RoleRedirectProps) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return

    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }

    if (session?.user?.role && allowedRoles && !allowedRoles.includes(session.user.role)) {
      // Redirect based on role
      const roleRedirects: Record<string, string> = {
        admin: process.env.NEXT_PUBLIC_ADMIN_APP_URL || 'http://localhost:3001',
        artist: process.env.NEXT_PUBLIC_ARTIST_APP_URL || 'http://localhost:3002',
        operator: process.env.NEXT_PUBLIC_OPERATOR_APP_URL || 'http://localhost:3003',
        social_worker: process.env.NEXT_PUBLIC_SOCIAL_WORKER_APP_URL || 'http://localhost:3004',
        customer: redirectTo || '/'
      }
      
      const redirectUrl = roleRedirects[session.user.role]
      if (redirectUrl && redirectUrl !== window.location.href) {
        if (redirectUrl.startsWith('http')) {
          window.open(redirectUrl, '_blank')
        } else {
          router.push(redirectUrl)
        }
      }
    }
  }, [session, status, allowedRoles, redirectTo, router])

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return null
  }

  if (session?.user?.role && allowedRoles && !allowedRoles.includes(session.user.role)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Redirecting to your app...
          </h2>
          <p className="text-gray-600">
            You don't have access to this page. Redirecting you to the appropriate application.
          </p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

// Convenience components for specific roles
export function AdminOnly({ children }: { children: React.ReactNode }) {
  return <RoleRedirect allowedRoles={['admin']}>{children}</RoleRedirect>
}

export function ArtistOnly({ children }: { children: React.ReactNode }) {
  return <RoleRedirect allowedRoles={['artist']}>{children}</RoleRedirect>
}

export function OperatorOnly({ children }: { children: React.ReactNode }) {
  return <RoleRedirect allowedRoles={['operator']}>{children}</RoleRedirect>
}

export function CustomerOnly({ children }: { children: React.ReactNode }) {
  return <RoleRedirect allowedRoles={['customer']}>{children}</RoleRedirect>
}
