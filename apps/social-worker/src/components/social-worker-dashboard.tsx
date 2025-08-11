'use client'

import { useState } from 'react'

interface Campaign {
  id: string
  title: string
  status: 'active' | 'paused' | 'completed'
  reach: number
  engagement: number
  startDate: string
}

interface CommunityEvent {
  id: string
  title: string
  date: string
  location: string
  attendees: number
  status: 'upcoming' | 'ongoing' | 'completed'
}

export function SocialWorkerDashboard() {
  const [activeTab, setActiveTab] = useState<'campaigns' | 'events' | 'analytics'>('campaigns')

  const campaigns: Campaign[] = [
    {
      id: '1',
      title: 'Mental Health Awareness',
      status: 'active',
      reach: 15420,
      engagement: 2340,
      startDate: '2024-01-15'
    },
    {
      id: '2',
      title: 'Community Support Network',
      status: 'active',
      reach: 8920,
      engagement: 1560,
      startDate: '2024-01-20'
    },
    {
      id: '3',
      title: 'Youth Empowerment Program',
      status: 'paused',
      reach: 12340,
      engagement: 2100,
      startDate: '2024-01-10'
    }
  ]

  const events: CommunityEvent[] = [
    {
      id: '1',
      title: 'Community Wellness Workshop',
      date: '2024-02-15',
      location: 'Community Center',
      attendees: 45,
      status: 'upcoming'
    },
    {
      id: '2',
      title: 'Support Group Meeting',
      date: '2024-02-10',
      location: 'Library Meeting Room',
      attendees: 23,
      status: 'ongoing'
    },
    {
      id: '3',
      title: 'Family Resource Fair',
      date: '2024-01-25',
      location: 'Town Hall',
      attendees: 120,
      status: 'completed'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'upcoming':
        return 'bg-green-100 text-green-800'
      case 'paused':
      case 'ongoing':
        return 'bg-yellow-100 text-yellow-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Active Campaigns</h3>
          <p className="text-2xl font-bold text-gray-900">{campaigns.filter(c => c.status === 'active').length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Reach</h3>
          <p className="text-2xl font-bold text-gray-900">{campaigns.reduce((sum, c) => sum + c.reach, 0).toLocaleString()}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Upcoming Events</h3>
          <p className="text-2xl font-bold text-gray-900">{events.filter(e => e.status === 'upcoming').length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Attendees</h3>
          <p className="text-2xl font-bold text-gray-900">{events.reduce((sum, e) => sum + e.attendees, 0)}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {[
              { id: 'campaigns', label: 'Social Campaigns' },
              { id: 'events', label: 'Community Events' },
              { id: 'analytics', label: 'Analytics' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'campaigns' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Social Media Campaigns</h3>
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
                  New Campaign
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reach</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Engagement</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {campaigns.map((campaign) => (
                      <tr key={campaign.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{campaign.title}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(campaign.status)}`}>
                            {campaign.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{campaign.reach.toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{campaign.engagement.toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(campaign.startDate).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'events' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Community Events</h3>
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
                  New Event
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {events.map((event) => (
                  <div key={event.id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900">{event.title}</h4>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(event.status)}`}>
                        {event.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{new Date(event.date).toLocaleDateString()}</p>
                    <p className="text-sm text-gray-600 mb-2">{event.location}</p>
                    <p className="text-sm text-gray-600">{event.attendees} attendees</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Analytics Dashboard</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-4">Campaign Performance</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Reach</span>
                      <span className="text-sm font-medium text-gray-900">{campaigns.reduce((sum, c) => sum + c.reach, 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Engagement</span>
                      <span className="text-sm font-medium text-gray-900">{campaigns.reduce((sum, c) => sum + c.engagement, 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Engagement Rate</span>
                      <span className="text-sm font-medium text-gray-900">
                        {((campaigns.reduce((sum, c) => sum + c.engagement, 0) / campaigns.reduce((sum, c) => sum + c.reach, 0)) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-4">Event Statistics</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Events</span>
                      <span className="text-sm font-medium text-gray-900">{events.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Attendees</span>
                      <span className="text-sm font-medium text-gray-900">{events.reduce((sum, e) => sum + e.attendees, 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Avg. Attendance</span>
                      <span className="text-sm font-medium text-gray-900">
                        {Math.round(events.reduce((sum, e) => sum + e.attendees, 0) / events.length)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
