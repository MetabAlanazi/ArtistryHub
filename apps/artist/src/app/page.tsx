'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Button } from '@artistry-hub/ui'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@artistry-hub/ui'
import { Palette, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-purple-600" />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (status === 'authenticated') {
    return null // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-purple-600 p-4 rounded-full">
              <Palette className="h-12 w-12 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to ArtistHub
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Your creative journey starts here. Access your artist dashboard, manage your portfolio, 
            and connect with art enthusiasts worldwide.
          </p>

          <div className="flex justify-center space-x-4">
            <Link href="/auth/login">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                Sign In to Artist Portal
              </Button>
            </Link>
            
            <Link href="/store">
              <Button variant="outline" size="lg">
                Visit Art Store
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardHeader className="text-center">
              <div className="bg-purple-100 p-3 rounded-full w-fit mx-auto mb-4">
                <Palette className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle>Portfolio Management</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <CardDescription>
                Showcase your artwork with a professional portfolio that highlights your unique style and creativity.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <div className="bg-blue-100 p-3 rounded-full w-fit mx-auto mb-4">
                <Palette className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle>Commission Handling</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <CardDescription>
                Manage custom art requests and commissions with our streamlined workflow and communication tools.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <div className="bg-green-100 p-3 rounded-full w-fit mx-auto mb-4">
                <Palette className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle>Art Sales</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <CardDescription>
                Sell your artwork directly to art lovers through our integrated marketplace and secure payment system.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <div className="mt-16 text-center">
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to get started?</h3>
            <p className="text-gray-600 mb-4">
              Sign in to access your artist dashboard and start building your creative empire.
            </p>
            <Link href="/auth/login">
              <Button className="bg-purple-600 hover:bg-purple-700">
                Access Artist Portal
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
