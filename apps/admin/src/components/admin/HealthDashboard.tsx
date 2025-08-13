'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@artistry-hub/ui/card';
import { Badge } from '@artistry-hub/ui/badge';
import { Button } from '@artistry-hub/ui/button';
import { RefreshCw, AlertTriangle, CheckCircle, XCircle, Clock } from 'lucide-react';

interface ServiceHealth {
  status: 'healthy' | 'unhealthy' | 'unknown';
  responseTime: number;
  lastChecked: string;
  error?: string;
}

interface HealthStatus {
  status: 'healthy' | 'unhealthy' | 'degraded';
  timestamp: string;
  uptime: number;
  services: {
    database: ServiceHealth;
    bff: ServiceHealth;
    minio: ServiceHealth;
    redis?: ServiceHealth;
    auth: ServiceHealth;
  };
  system: {
    memory: NodeJS.MemoryUsage;
    platform: string;
    nodeVersion: string;
  };
}

export default function HealthDashboard() {
  const [healthData, setHealthData] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  const fetchHealthData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/health');
      if (!response.ok) {
        throw new Error(`Health check failed: ${response.status}`);
      }
      
      const data = await response.json();
      setHealthData(data);
      setLastRefresh(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch health data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealthData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchHealthData, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'degraded':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'unhealthy':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy':
        return <Badge variant="default" className="bg-green-100 text-green-800">Healthy</Badge>;
      case 'degraded':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Degraded</Badge>;
      case 'unhealthy':
        return <Badge variant="destructive">Unhealthy</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const formatMemory = (bytes: number) => {
    const mb = bytes / 1024 / 1024;
    return `${mb.toFixed(1)} MB`;
  };

  if (loading && !healthData) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="w-6 h-6 animate-spin mr-2" />
        <span>Loading health status...</span>
      </div>
    );
  }

  if (error && !healthData) {
    return (
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <XCircle className="w-6 h-6 text-red-500" />
              Health Check Failed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={fetchHealthData} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!healthData) return null;

  const { services, system, uptime } = healthData;
  const overallStatus = healthData.status;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">System Health Dashboard</h1>
          <p className="text-gray-600">
            Last updated: {lastRefresh?.toLocaleTimeString() || 'Never'}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {getStatusIcon(overallStatus)}
            <span className="font-medium">Overall Status:</span>
            {getStatusBadge(overallStatus)}
          </div>
          <Button onClick={fetchHealthData} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Database */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-lg">
              <span>Database</span>
              {getStatusIcon(services.database.status)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {getStatusBadge(services.database.status)}
              <div className="text-sm text-gray-600">
                <p>Response: {services.database.responseTime}ms</p>
                <p>Last Check: {new Date(services.database.lastChecked).toLocaleTimeString()}</p>
                {services.database.error && (
                  <p className="text-red-600 text-xs mt-2">{services.database.error}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* BFF */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-lg">
              <span>BFF Service</span>
              {getStatusIcon(services.bff.status)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {getStatusBadge(services.bff.status)}
              <div className="text-sm text-gray-600">
                <p>Response: {services.bff.responseTime}ms</p>
                <p>Last Check: {new Date(services.bff.lastChecked).toLocaleTimeString()}</p>
                {services.bff.error && (
                  <p className="text-red-600 text-xs mt-2">{services.bff.error}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* MinIO */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-lg">
              <span>MinIO Storage</span>
              {getStatusIcon(services.minio.status)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {getStatusBadge(services.minio.status)}
              <div className="text-sm text-gray-600">
                <p>Response: {services.minio.responseTime}ms</p>
                <p>Last Check: {new Date(services.minio.lastChecked).toLocaleTimeString()}</p>
                {services.minio.error && (
                  <p className="text-red-600 text-xs mt-2">{services.minio.error}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Auth Service */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-lg">
              <span>Auth Service</span>
              {getStatusIcon(services.auth.status)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {getStatusBadge(services.auth.status)}
              <div className="text-sm text-gray-600">
                <p>Response: {services.auth.responseTime}ms</p>
                <p>Last Check: {new Date(services.auth.lastChecked).toLocaleTimeString()}</p>
                {services.auth.error && (
                  <p className="text-red-600 text-xs mt-2">{services.auth.error}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Info */}
      <Card>
        <CardHeader>
          <CardTitle>System Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-medium mb-2">Runtime</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p>Uptime: {formatUptime(uptime)}</p>
                <p>Platform: {system.platform}</p>
                <p>Node.js: {system.nodeVersion}</p>
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-2">Memory Usage</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p>RSS: {formatMemory(system.memory.rss)}</p>
                <p>Heap Used: {formatMemory(system.memory.heapUsed)}</p>
                <p>Heap Total: {formatMemory(system.memory.heapTotal)}</p>
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-2">Auto-refresh</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p>Interval: 30 seconds</p>
                <p>Next refresh: {lastRefresh ? new Date(lastRefresh.getTime() + 30000).toLocaleTimeString() : 'Unknown'}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alerts */}
      {Object.values(services).some(s => s.status === 'unhealthy') && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="w-5 h-5" />
              Critical Issues Detected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(services).map(([name, service]) => 
                service.status === 'unhealthy' && (
                  <div key={name} className="flex items-center gap-2 text-red-700">
                    <XCircle className="w-4 h-4" />
                    <span className="capitalize">{name}:</span>
                    <span>{service.error}</span>
                  </div>
                )
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
