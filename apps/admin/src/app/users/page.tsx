'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { UserRole } from '@artistryhub/auth';

interface User {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  targetAppUrl: string | null;
  updatedAt: string;
  mustReauthAt: string | null;
}

interface UserUpdateData {
  role?: UserRole;
  targetAppUrl?: string | null;
}

export default function UsersPage() {
  const { data: session, status } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [editData, setEditData] = useState<UserUpdateData>({});

  useEffect(() => {
    if (status === 'authenticated') {
      fetchUsers();
    }
  }, [status]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      setUsers(data.users);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user.id);
    setEditData({
      role: user.role,
      targetAppUrl: user.targetAppUrl,
    });
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setEditData({});
  };

  const handleSaveUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editData),
      });

      if (!response.ok) {
        throw new Error('Failed to update user');
      }

      const updatedUser = await response.json();
      
      // Update the local state
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, ...updatedUser.user } : user
      ));

      setSuccessMessage('User updated successfully. User will be redirected on next request.');
      setEditingUser(null);
      setEditData({});
      
      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user');
    }
  };

  const getEffectiveUrl = (user: User) => {
    if (user.targetAppUrl) {
      return user.targetAppUrl;
    }
    
    // Fallback to role-based mapping
    const roleUrls: Record<UserRole, string> = {
      customer: process.env.NEXT_PUBLIC_STORE_APP_URL || 'http://localhost:3000',
      admin: process.env.NEXT_PUBLIC_ADMIN_APP_URL || 'http://localhost:3001',
      artist: process.env.NEXT_PUBLIC_ARTIST_APP_URL || 'http://localhost:3002',
      operator: process.env.NEXT_PUBLIC_OPERATOR_APP_URL || 'http://localhost:3003',
      service: process.env.NEXT_PUBLIC_SOCIAL_WORKER_APP_URL || 'http://localhost:3004',
      social_worker: process.env.NEXT_PUBLIC_SOCIAL_WORKER_APP_URL || 'http://localhost:3004',
    };
    
    return roleUrls[user.role];
  };

  const openUserSite = (url: string) => {
    window.open(url, '_blank');
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">You must be logged in to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="mt-2 text-gray-600">
            Manage user roles, target URLs, and force session invalidation
          </p>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
            {successMessage}
          </div>
        )}

        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading users...</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {users.map((user) => (
                <li key={user.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                            <span className="text-indigo-800 font-medium">
                              {user.name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {user.name || 'No name'}
                          </p>
                          <p className="text-sm text-gray-500 truncate">{user.email}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      {/* Current Role Display */}
                      <div className="text-sm">
                        <span className="text-gray-500">Role:</span>
                        <span className="ml-1 font-medium text-gray-900">{user.role}</span>
                      </div>

                      {/* Effective URL Display */}
                      <div className="text-sm">
                        <span className="text-gray-500">Effective URL:</span>
                        <span className="ml-1 font-medium text-gray-900">
                          {getEffectiveUrl(user)}
                        </span>
                      </div>

                      {/* Open User Site Button */}
                      <button
                        onClick={() => openUserSite(getEffectiveUrl(user))}
                        disabled={editingUser === user.id}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Open Site
                      </button>

                      {/* Edit Button */}
                      {editingUser !== user.id ? (
                        <button
                          onClick={() => handleEditUser(user)}
                          className="inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                        >
                          Edit
                        </button>
                      ) : (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleSaveUser(user.id)}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-white bg-indigo-600 hover:bg-indigo-700"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Edit Form */}
                  {editingUser === user.id && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Role
                          </label>
                          <select
                            value={editData.role || user.role}
                            onChange={(e) => setEditData(prev => ({ ...prev, role: e.target.value as UserRole }))}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          >
                            <option value="customer">Customer</option>
                            <option value="artist">Artist</option>
                            <option value="operator">Operator</option>
                            <option value="service">Service</option>
                            <option value="social_worker">Social Worker</option>
                            <option value="admin">Admin</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Target App URL (optional)
                          </label>
                          <input
                            type="url"
                            value={editData.targetAppUrl || ''}
                            onChange={(e) => setEditData(prev => ({ 
                              ...prev, 
                              targetAppUrl: e.target.value || null 
                            }))}
                            placeholder="Leave blank to use role default"
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </div>
                      </div>
                      
                      <div className="mt-3 text-sm text-gray-600">
                        <p>⚠️ Changing role or target URL will force the user to re-authenticate on their next request.</p>
                      </div>
                    </div>
                  )}

                  {/* Last Updated Info */}
                  <div className="mt-2 text-xs text-gray-500">
                    Last updated: {new Date(user.updatedAt).toLocaleString()}
                    {user.mustReauthAt && (
                      <span className="ml-4 text-orange-600">
                        Re-auth required at: {new Date(user.mustReauthAt).toLocaleString()}
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
