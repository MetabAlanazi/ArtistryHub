import { useState, useEffect, useCallback } from 'react';

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

export function useHealthCheck(autoRefresh = true, refreshInterval = 30000) {
  const [healthData, setHealthData] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  const fetchHealth = useCallback(async () => {
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
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch health data';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHealth();
    
    if (autoRefresh) {
      const interval = setInterval(fetchHealth, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [fetchHealth, autoRefresh, refreshInterval]);

  const isServiceHealthy = useCallback((serviceName: keyof HealthStatus['services']) => {
    if (!healthData) return false;
    return healthData.services[serviceName]?.status === 'healthy';
  }, [healthData]);

  const getOverallStatus = useCallback(() => {
    if (!healthData) return 'unknown';
    return healthData.status;
  }, [healthData]);

  const getServiceStatus = useCallback((serviceName: keyof HealthStatus['services']) => {
    if (!healthData) return 'unknown';
    return healthData.services[serviceName]?.status || 'unknown';
  }, [healthData]);

  const getServiceError = useCallback((serviceName: keyof HealthStatus['services']) => {
    if (!healthData) return null;
    return healthData.services[serviceName]?.error || null;
  }, [healthData]);

  const hasCriticalIssues = useCallback(() => {
    if (!healthData) return false;
    return Object.values(healthData.services).some(s => s.status === 'unhealthy');
  }, [healthData]);

  return {
    healthData,
    loading,
    error,
    lastRefresh,
    fetchHealth,
    isServiceHealthy,
    getOverallStatus,
    getServiceStatus,
    getServiceError,
    hasCriticalIssues,
  };
}
