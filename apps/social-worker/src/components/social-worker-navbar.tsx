'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { Menu, X, Users, MessageCircle, TrendingUp, Home, LogOut, User } from 'lucide-react'

export function SocialWorkerNavbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { data: session } = useSession()

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Campaigns', href: '/campaigns', icon: MessageCircle },
    { name: 'Events', href: '/events', icon: Users },
    { name: 'Analytics', href: '/analytics', icon: TrendingUp },
  ]

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">Social Worker Portal</span>
              </Link>
            </div>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900 border-b-2 border-transparent hover:border-purple-300"
                >
                  <item.icon className="w-4 h-4 mr-2" />
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Main Store Link */}
            <Link
              href="http://localhost:3000/store"
              className="hidden md:inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <Home className="w-4 h-4 mr-2" />
              Main Store
            </Link>

            {/* User Menu */}
            {session?.user ? (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {session.user?.name?.charAt(0) || session.user?.email?.charAt(0) || 'U'}
                  </span>
                </div>
                <span className="hidden md:block text-sm text-gray-700">{session.user?.name || session.user?.email}</span>
                <button
                  onClick={() => signOut({ callbackUrl: 'http://localhost:3000' })}
                  className="flex items-center text-gray-600 hover:text-red-600 px-3 py-2 text-sm font-medium transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <span className="hidden md:block text-sm text-gray-700">Not Signed In</span>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                onClick={() => setIsOpen(false)}
              >
                <item.icon className="w-4 h-4 mr-3" />
                {item.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-gray-200">
              <Link
                href="http://localhost:3000/store"
                className="flex items-center px-3 py-2 text-base font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-md"
                onClick={() => setIsOpen(false)}
              >
                <Home className="w-4 h-4 mr-3" />
                Main Store
              </Link>
              
              {session?.user && (
                <>
                  <div className="flex items-center space-x-3 px-3 py-2 mt-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {session.user?.name?.charAt(0) || session.user?.email?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{session.user?.name || session.user?.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      signOut({ callbackUrl: 'http://localhost:3000' });
                      setIsOpen(false);
                    }}
                    className="flex items-center w-full px-3 py-2 text-base font-medium text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Sign Out
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
