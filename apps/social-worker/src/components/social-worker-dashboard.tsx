'use client'

import { useSession } from 'next-auth/react'
import { 
  Instagram, 
  Facebook, 
  Twitter, 
  Youtube,
  TrendingUp,
  Users,
  MessageCircle,
  Calendar
} from 'lucide-react'

export function SocialWorkerDashboard() {
  const { data: session } = useSession()

  const stats = [
    {
      title: 'Active Campaigns',
      value: '12',
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Social Channels',
      value: '8',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Posts This Month',
      value: '156',
      icon: MessageCircle,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Scheduled Posts',
      value: '23',
      icon: Calendar,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ]

  const recentCampaigns = [
    {
      id: 1,
      name: 'Summer Art Collection',
      platform: 'Instagram',
      status: 'Active',
      posts: 24,
      engagement: '12.5%',
      color: 'bg-gradient-to-r from-purple-400 to-pink-400'
    },
    {
      id: 2,
      name: 'Artist Spotlight Series',
      platform: 'Facebook',
      status: 'Active',
      posts: 18,
      engagement: '8.9%',
      color: 'bg-gradient-to-r from-blue-400 to-cyan-400'
    },
    {
      id: 3,
      name: 'Community Art Challenge',
      platform: 'Twitter',
      status: 'Planning',
      posts: 0,
      engagement: '0%',
      color: 'bg-gradient-to-r from-green-400 to-emerald-400'
    }
  ]

  const socialChannels = [
    { name: 'Instagram', icon: Instagram, color: 'text-pink-600', followers: '12.5K', posts: 156 },
    { name: 'Facebook', icon: Facebook, color: 'text-blue-600', followers: '8.9K', posts: 89 },
    { name: 'Twitter', icon: Twitter, color: 'text-sky-600', followers: '5.2K', posts: 234 },
    { name: 'YouTube', icon: Youtube, color: 'text-red-600', followers: '3.1K', posts: 45 }
  ]

  if (!session) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Instagram className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Welcome to Social Worker Portal</h2>
        <p className="text-gray-600 mb-6">Sign in to manage your social media campaigns and community outreach</p>
        <button className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
          Sign In to Continue
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
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
        {/* Recent Campaigns */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Campaigns</h3>
          <div className="space-y-4">
            {recentCampaigns.map((campaign) => (
              <div key={campaign.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${campaign.color}`}>
                    <span className="text-white font-semibold text-sm">
                      {campaign.platform.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{campaign.name}</p>
                    <p className="text-sm text-gray-500">{campaign.platform}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{campaign.posts} posts</p>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    campaign.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {campaign.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Social Channels */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Channels</h3>
          <div className="space-y-4">
            {socialChannels.map((channel) => (
              <div key={channel.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <channel.icon className={`w-8 h-8 ${channel.color}`} />
                  <div>
                    <p className="font-medium text-gray-900">{channel.name}</p>
                    <p className="text-sm text-gray-500">{channel.followers} followers</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{channel.posts} posts</p>
                  <button className="text-xs text-purple-600 hover:text-purple-700">
                    Manage
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-colors text-center">
            <Instagram className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="font-medium text-gray-900">Create Campaign</p>
            <p className="text-sm text-gray-500">Start a new social media campaign</p>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-400 hover:bg-green-50 transition-colors text-center">
            <MessageCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="font-medium text-gray-900">Schedule Post</p>
            <p className="text-sm text-gray-500">Plan content for later</p>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors text-center">
            <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="font-medium text-gray-900">View Analytics</p>
            <p className="text-sm text-gray-500">Check campaign performance</p>
          </button>
        </div>
      </div>
    </div>
  )
}
