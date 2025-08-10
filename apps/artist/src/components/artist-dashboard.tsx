'use client'

import { useQuery } from '@tanstack/react-query'
import { PrismaClient } from '@artistry-hub/db'
import { formatSAR } from '@artistry-hub/utils'
import { 
  Palette, 
  Upload, 
  Calendar,
  TrendingUp,
  Eye,
  CheckCircle,
  Clock
} from 'lucide-react'

const prisma = new PrismaClient()

async function getArtistDashboard() {
  // This would be filtered by the current artist's ID in a real app
  const [
    totalProducts,
    pendingSubmissions,
    activeCommissions,
    totalEarnings
  ] = await Promise.all([
    prisma.product.count({
      where: { status: 'PUBLISHED' }
    }),
    prisma.submission.count({
      where: { status: 'REVIEW' }
    }),
    prisma.commission.count({
      where: { 
        status: { in: ['APPROVED', 'IN_PROGRESS', 'READY'] }
      }
    }),
    prisma.payment.aggregate({
      where: { status: 'PAID' },
      _sum: { amountCents: true }
    })
  ])

  return {
    totalProducts,
    pendingSubmissions,
    activeCommissions,
    totalEarnings: totalEarnings._sum.amountCents || 0
  }
}

export function ArtistDashboard() {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['artist-dashboard'],
    queryFn: getArtistDashboard,
  })

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="card p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-red-600">
        Failed to load dashboard
      </div>
    )
  }

  const statCards = [
    {
      title: 'Published Products',
      value: stats?.totalProducts || 0,
      icon: Palette,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Pending Submissions',
      value: stats?.pendingSubmissions || 0,
      icon: Upload,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      title: 'Active Commissions',
      value: stats?.activeCommissions || 0,
      icon: Calendar,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Total Earnings',
      value: formatSAR(stats?.totalEarnings || 0),
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ]

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div key={stat.title} className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-3 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors">
              <div className="flex items-center">
                <Upload className="w-5 h-5 text-primary-600 mr-3" />
                <span className="text-sm font-medium">Submit New Product</span>
              </div>
              <span className="text-xs text-primary-600">→</span>
            </button>
            <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center">
                <Eye className="w-5 h-5 text-gray-600 mr-3" />
                <span className="text-sm font-medium">View Profile</span>
              </div>
              <span className="text-xs text-gray-600">→</span>
            </button>
            <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 text-gray-600 mr-3" />
                <span className="text-sm font-medium">Manage Commissions</span>
              </div>
              <span className="text-xs text-gray-600">→</span>
            </button>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">Product approved</p>
                <p className="text-xs text-gray-500">Abstract Harmony #1</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="text-sm font-medium">Commission in progress</p>
                <p className="text-xs text-gray-500">Custom painting for Ahmed</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Upload className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">New submission</p>
                <p className="text-xs text-gray-500">Desert Sunset #5</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}



