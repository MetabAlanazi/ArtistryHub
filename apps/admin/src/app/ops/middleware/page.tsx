'use client';

import { useState, useEffect } from 'react';

interface ServiceData {
  name: string;
  enabled: boolean;
  ok: number;
  err: number;
  avgMs: number;
  windowMin: number;
}

const fetcher = (u: string) => fetch(u, { cache: 'no-store' }).then(r => r.json());

export default function MiddlewareOps() {
  const [data, setData] = useState<{ services: ServiceData[] } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const result = await fetcher('/api/mw/state');
      setData(result);
      setError(null);
    } catch (err) {
      setError('Failed to fetch middleware data');
      console.error('Error fetching middleware data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  async function toggle(name: string, enabled: boolean) {
    try {
      await fetch('/api/mw/state', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-ops-action': process.env.NEXT_PUBLIC_OPS_ACTION_PUBLIC ?? '',
        },
        body: JSON.stringify({ name, enabled }),
      });
      fetchData(); // Refresh data
    } catch (err) {
      console.error('Error toggling middleware:', err);
      setError('Failed to toggle middleware');
    }
  }

  if (isLoading && !data) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Loading middleware data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Middleware Control</h1>
        <button
          onClick={fetchData}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">App</th>
              <th className="p-3">Status</th>
              <th className="p-3">5m OK</th>
              <th className="p-3">5m ERR</th>
              <th className="p-3">Avg Latency</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {data?.services?.map((s: ServiceData) => (
              <tr key={s.name} className="border-t hover:bg-gray-50">
                <td className="p-3 font-medium capitalize">{s.name.replace('-', ' ')}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    s.enabled 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {s.enabled ? 'ENABLED' : 'DISABLED'}
                  </span>
                </td>
                <td className="p-3 text-center">
                  <span className="text-green-600 font-medium">{s.ok}</span>
                </td>
                <td className="p-3 text-center">
                  <span className="text-red-600 font-medium">{s.err}</span>
                </td>
                <td className="p-3 text-center">
                  <span className="text-blue-600 font-medium">{s.avgMs} ms</span>
                </td>
                <td className="p-3">
                  <button
                    onClick={() => toggle(s.name, !s.enabled)}
                    className={`px-3 py-1 rounded border transition-colors ${
                      s.enabled
                        ? 'bg-red-50 text-red-700 border-red-300 hover:bg-red-100'
                        : 'bg-green-50 text-green-700 border-green-300 hover:bg-green-100'
                    }`}
                  >
                    {s.enabled ? 'Stop' : 'Start'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-xs text-gray-500 space-y-2">
        <p>• Metrics are per-minute buckets aggregated over the last 5 minutes</p>
        <p>• Middleware is fail-open: if Redis is unavailable, all middleware runs enabled</p>
        <p>• Toggle changes take effect immediately for new requests</p>
      </div>
    </div>
  );
}
