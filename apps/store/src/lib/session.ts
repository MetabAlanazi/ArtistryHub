import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export function useRequireAuth(redirectTo = '/login') {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push(`${redirectTo}?next=${encodeURIComponent(window.location.pathname)}`)
    }
  }, [session, status, router, redirectTo])

  return { session, status, isLoading: status === 'loading' }
}

export function useOptionalAuth() {
  const { data: session, status } = useSession()
  return { session, status, isLoading: status === 'loading' }
}

export function getSessionRedirectUrl(pathname: string): string {
  return `/login?next=${encodeURIComponent(pathname)}`
}

export function isAuthenticated(session: any): boolean {
  return !!session?.user
}

export function hasRole(session: any, role: string): boolean {
  return session?.user?.role === role
}

export function hasAnyRole(session: any, roles: string[]): boolean {
  return roles.includes(session?.user?.role)
}
