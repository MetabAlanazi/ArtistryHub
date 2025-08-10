import { SocialWorkerDashboard } from '@/components/social-worker-dashboard'
import { SocialWorkerNavbar } from '@/components/social-worker-navbar'

export default function SocialWorkerPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <SocialWorkerNavbar />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Social Worker Portal</h1>
          <p className="text-gray-600 mt-2">Manage social media campaigns and community outreach</p>
        </div>
        <SocialWorkerDashboard />
      </main>
    </div>
  )
}
