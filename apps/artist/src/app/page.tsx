import { Suspense } from 'react'
import { ArtistDashboard } from '@/components/artist-dashboard'

export default function ArtistHomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Artist Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Manage your profile, submissions, and commissions
        </p>
      </div>

      <Suspense fallback={<div>Loading dashboard...</div>}>
        <ArtistDashboard />
      </Suspense>
    </div>
  )
}


