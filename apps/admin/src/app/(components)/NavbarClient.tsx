'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NAV_ITEMS, APP_TITLE } from './nav.config'
import { useState } from 'react'
import { signOut } from 'next-auth/react'

function cx(...a: (string | false | undefined)[]) {
  return a.filter(Boolean).join(' ')
}

type MinimalUser = { name: string | null; image?: string | null }

export default function NavbarClient({ user }: { user: MinimalUser | null }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <div className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        {/* Left: brand + desktop links */}
        <div className="flex items-center gap-6">
          <Link href="http://localhost:3000/store" className="font-semibold text-blue-600 hover:text-blue-800">
            🏠 Main Store
          </Link>
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
          </nav>
        </div>

        {/* Right: user */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2">
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
              <div className="flex flex-col">
                <span className="text-xs text-gray-500">Logged in as:</span>
                <span className="text-sm font-medium text-gray-800">{user.name ?? 'User'}</span>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: 'http://localhost:3000/store' })}
                className="ml-2 px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                🚪 Logout
              </button>
            </div>
          ) : (
            <Link href="/login" className="text-sm underline">
              Login
            </Link>
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
          </nav>
        </div>
      )}
    </div>
  )
}
