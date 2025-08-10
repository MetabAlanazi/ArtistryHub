'use client'

import { useQuery } from '@tanstack/react-query'
import { formatDateTime } from '@artistry-hub/utils'
import { PrismaClient } from '@artistry-hub/db'
import { Check, X, Eye } from 'lucide-react'
import Link from 'next/link'

const prisma = new PrismaClient()

async function getPendingSubmissions() {
  return prisma.submission.findMany({
    where: { status: 'REVIEW' },
    include: {
      product: {
        include: {
          artistRef: true
        }
      },
      artist: true
    },
    orderBy: { createdAt: 'desc' },
    take: 5
  })
}

export function ProductApprovals() {
  const { data: submissions, isLoading, error } = useQuery({
    queryKey: ['pending-submissions'],
    queryFn: getPendingSubmissions,
  })

  if (isLoading) {
    return (
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Approvals</h3>
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Approvals</h3>
        <div className="text-center text-red-600">
          Failed to load pending submissions
        </div>
      </div>
    )
  }

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Product Approvals</h3>
        <Link href="/submissions" className="text-sm text-primary-600 hover:text-primary-700">
          View all
        </Link>
      </div>
      <div className="space-y-4">
        {submissions?.length === 0 ? (
          <p className="text-center text-gray-500 py-4">No pending approvals</p>
        ) : (
          submissions?.map((submission) => (
            <div key={submission.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <Eye className="w-4 h-4 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {submission.product.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    by {submission.artist.displayName} • {formatDateTime(submission.createdAt)}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-1 text-green-600 hover:text-green-700">
                  <Check className="w-4 h-4" />
                </button>
                <button className="p-1 text-red-600 hover:text-red-700">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}



