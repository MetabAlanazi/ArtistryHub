'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NAV_ITEMS, APP_TITLE } from './nav.config'
import { useState } from 'react'
import { signOut } from 'next-auth/react'

function cx(...a: (string | false | undefined)[]) {
  return a.filter(Boolean).join(' ')
}

type MinimalUser = { name: string | null | undefined; email?: string | null; image?: string | null; role?: string }

export default function NavbarClient({ user }: { user: MinimalUser | null }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' })
  }

  // Role-based app navigation
  const getRoleBasedLinks = () => {
    if (!user?.role) return []
    
    switch (user.role) {
      case 'admin':
        return [
          { label: 'Admin Panel', href: 'http://localhost:3001', external: true, color: 'text-red-600 hover:text-red-700', icon: '👑' }
        ]
      case 'artist':
        return [
          { label: 'Artist Dashboard', href: 'http://localhost:3002', external: true, color: 'text-purple-600 hover:text-purple-700', icon: '🎨' }
        ]
      case 'operator':
        return [
          { label: 'Operator Panel', href: 'http://localhost:3003', external: true, color: 'text-blue-600 hover:text-blue-700', icon: '⚙️' }
        ]
      case 'social_worker':
        return [
          { label: 'Social Worker', href: 'http://localhost:3004', external: true, color: 'text-green-600 hover:text-green-700', icon: '🤝' }
        ]
      default:
        return []
    }
  }

  const roleLinks = getRoleBasedLinks()

  // Role badge colors
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800 border-red-200'
      case 'artist': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'operator': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'social_worker': return 'bg-green-100 text-green-800 border-green-200'
      case 'customer': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        {/* Left: brand + desktop links */}
        <div className="flex items-center gap-6">
          <Link href="/" className="font-semibold">
            {APP_TITLE}
          </Link>
          <nav className="hidden md:flex items-center gap-4">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cx(
                  'text-sm text-gray-600 hover:text-gray-900',
                  pathname === item.href &&
                    'font-semibold text-gray-900 border-b-2 border-gray-900'
                )}
              >
                {item.label}
              </Link>
            ))}
            {/* Role-based app links */}
            {roleLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noopener noreferrer' : undefined}
                className={`text-sm font-medium ${link.color} hover:underline flex items-center gap-1`}
              >
                <span>{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right: authentication */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors"
              >
                {user.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.image}
                    alt="avatar"
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-xs font-medium">
                    {(user.name ?? 'U').slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div className="hidden sm:block text-left">
                  <div className="text-sm text-gray-800 font-medium">{user.name ?? 'User'}</div>
                  {user.role && (
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getRoleBadgeColor(user.role)}`}>
                      {user.role}
                    </span>
                  )}
                </div>
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* User dropdown menu */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border py-1 z-50">
                  <div className="px-4 py-2 border-b">
                    <div className="text-sm font-medium text-gray-900">{user.name || 'User'}</div>
                    <div className="text-xs text-gray-500">{user.email}</div>
                    {user.role && (
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border mt-1 ${getRoleBadgeColor(user.role)}`}>
                        {user.role}
                      </span>
                    )}
                  </div>
                  
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  
                  {/* User-specific pages */}
                  <Link
                    href="/orders"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    📋 Orders
                  </Link>
                  
                  <Link
                    href="/wishlist"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    ❤️ Wishlist
                  </Link>
                  
                  {/* Role-based quick access */}
                  {roleLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <span className="flex items-center gap-2">
                        <span>{link.icon}</span>
                        Go to {link.label}
                      </span>
                    </Link>
                  ))}
                  
                  <div className="border-t pt-1">
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link 
                href="/login" 
                className="text-sm text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Login
              </Link>
              <Link 
                href="/register" 
                className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile menu button */}
          <button
            className="md:hidden rounded px-2 py-1 border"
            onClick={() => setOpen((v) => !v)}
          >
            Menu
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden border-t bg-white">
          <nav className="flex flex-col p-2">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cx(
                  'rounded px-2 py-2 text-gray-700 hover:bg-gray-50',
                  pathname === item.href && 'font-semibold text-gray-900'
                )}
              >
                {item.label}
              </Link>
            ))}
            {/* Role-based app links in mobile menu */}
            {roleLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className={`rounded px-2 py-2 ${link.color} hover:bg-gray-50 flex items-center gap-2`}
              >
                <span>{link.icon}</span>
                {link.label}
              </Link>
            ))}
            
            {/* User-specific pages in mobile menu */}
            {user && (
              <div className="border-t pt-2 mt-2">
                <Link
                  href="/profile"
                  onClick={() => setOpen(false)}
                  className="block px-2 py-2 text-gray-700 hover:bg-gray-50"
                >
                  👤 Profile
                </Link>
                <Link
                  href="/orders"
                  onClick={() => setOpen(false)}
                  className="block px-2 py-2 text-gray-700 hover:bg-gray-50"
                >
                  📋 Orders
                </Link>
                <Link
                  href="/wishlist"
                  onClick={() => setOpen(false)}
                  className="block px-2 py-2 text-gray-700 hover:bg-gray-50"
                >
                  ❤️ Wishlist
                </Link>
              </div>
            )}
            
            {!user && (
              <div className="border-t pt-2 mt-2">
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="block px-2 py-2 text-gray-700 hover:bg-gray-50"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setOpen(false)}
                  className="block px-2 py-2 text-gray-700 hover:bg-gray-50"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </div>
  )
}
