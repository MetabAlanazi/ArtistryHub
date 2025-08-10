'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { 
  Instagram, 
  Facebook, 
  Twitter, 
  Youtube,
  User,
  LogOut
} from 'lucide-react'

export function SocialWorkerNavbar() {
  const { data: session } = useSession()

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="http://localhost:3000/store" className="flex items-center space-x-2 text-blue-600 hover:text-blue-800">
              🏠 Main Store
            </Link>
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Instagram className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-xl text-gray-900">Social Worker</span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/campaigns" className="text-gray-600 hover:text-gray-900">
                Campaigns
              </Link>
              <Link href="/channels" className="text-gray-600 hover:text-gray-900">
                Channels
              </Link>
              <Link href="/analytics" className="text-gray-600 hover:text-gray-900">
                Analytics
              </Link>
              <Link href="/community" className="text-gray-600 hover:text-gray-900">
                Community
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {session ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 text-sm text-gray-700">
                  <User className="w-4 h-4" />
                  <span>{session.user?.name || 'User'}</span>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: 'http://localhost:3000/store' })}
                  className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <Link
                href="/auth/signin"
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
