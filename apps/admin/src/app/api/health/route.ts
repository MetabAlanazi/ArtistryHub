import { NextRequest, NextResponse } from 'next/server';

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

interface ServiceHealth {
  status: 'healthy' | 'unhealthy' | 'unknown';
  responseTime: number;
  lastChecked: string;
  error?: string;
}

async function checkDatabase(): Promise<ServiceHealth> {
  const start = Date.now();
  try {
    // Try to connect to database via BFF
    const response = await fetch(`${process.env.NEXT_PUBLIC_BFF_URL}/health`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    
    if (response.ok) {
      return {
        status: 'healthy',
        responseTime: Date.now() - start,
        lastChecked: new Date().toISOString(),
      };
    } else {
      return {
        status: 'unhealthy',
        responseTime: Date.now() - start,
        lastChecked: new Date().toISOString(),
        error: `Database check failed: ${response.status}`,
      };
    }
  } catch (error) {
    return {
      status: 'unhealthy',
      responseTime: Date.now() - start,
      lastChecked: new Date().toISOString(),
      error: `Database connection error: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

async function checkBFF(): Promise<ServiceHealth> {
  const start = Date.now();
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BFF_URL}/health`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    
    if (response.ok) {
      return {
        status: 'healthy',
        responseTime: Date.now() - start,
        lastChecked: new Date().toISOString(),
      };
    } else {
      return {
        status: 'unhealthy',
        responseTime: Date.now() - start,
        lastChecked: new Date().toISOString(),
        error: `BFF health check failed: ${response.status}`,
      };
    }
  } catch (error) {
    return {
      status: 'unhealthy',
      responseTime: Date.now() - start,
      lastChecked: new Date().toISOString(),
      error: `BFF connection error: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

async function checkMinIO(): Promise<ServiceHealth> {
  const start = Date.now();
  try {
    // Check if MinIO is accessible
    const response = await fetch(`${process.env.NEXT_PUBLIC_MEDIA_HOST || 'http://localhost:9000'}/minio/health/live`, {
      method: 'GET',
    });
    
    if (response.ok) {
      return {
        status: 'healthy',
        responseTime: Date.now() - start,
        lastChecked: new Date().toISOString(),
      };
    } else {
      return {
        status: 'degraded',
        responseTime: Date.now() - start,
        lastChecked: new Date().toISOString(),
        error: `MinIO health check failed: ${response.status}`,
      };
    }
  } catch (error) {
    return {
      status: 'unhealthy',
      responseTime: Date.now() - start,
      lastChecked: new Date().toISOString(),
      error: `MinIO connection error: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

async function checkAuth(): Promise<ServiceHealth> {
  const start = Date.now();
  try {
    // Check if auth service is responding
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3001'}/api/auth/session`, {
      method: 'GET',
    });
    
    if (response.ok) {
      return {
        status: 'healthy',
        responseTime: Date.now() - start,
        lastChecked: new Date().toISOString(),
      };
    } else {
      return {
        status: 'degraded',
        responseTime: Date.now() - start,
        lastChecked: new Date().toISOString(),
        error: `Auth service check failed: ${response.status}`,
      };
    }
  } catch (error) {
    return {
      status: 'unhealthy',
      responseTime: Date.now() - start,
      lastChecked: new Date().toISOString(),
      error: `Auth service error: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

export async function GET(request: NextRequest) {
  try {
    const [database, bff, minio, auth] = await Promise.allSettled([
      checkDatabase(),
      checkBFF(),
      checkMinIO(),
      checkAuth(),
    ]);

    const services = {
      database: database.status === 'fulfilled' ? database.value : {
        status: 'unhealthy' as const,
        responseTime: 0,
        lastChecked: new Date().toISOString(),
        error: 'Database check failed',
      },
      bff: bff.status === 'fulfilled' ? bff.value : {
        status: 'unhealthy' as const,
        responseTime: 0,
        lastChecked: new Date().toISOString(),
        error: 'BFF check failed',
      },
      minio: minio.status === 'fulfilled' ? minio.value : {
        status: 'unhealthy' as const,
        responseTime: 0,
        lastChecked: new Date().toISOString(),
        error: 'MinIO check failed',
      },
      auth: auth.status === 'fulfilled' ? auth.value : {
        status: 'unhealthy' as const,
        responseTime: 0,
        lastChecked: new Date().toISOString(),
        error: 'Auth check failed',
      },
    };

    // Determine overall status
    const healthyServices = Object.values(services).filter(s => s.status === 'healthy').length;
    const totalServices = Object.keys(services).length;
    
    let overallStatus: 'healthy' | 'unhealthy' | 'degraded' = 'healthy';
    if (healthyServices === 0) {
      overallStatus = 'unhealthy';
    } else if (healthyServices < totalServices) {
      overallStatus = 'degraded';
    }

    const healthStatus: HealthStatus = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      services,
      system: {
        memory: process.memoryUsage(),
        platform: process.platform,
        nodeVersion: process.version,
      },
    };

    return NextResponse.json(healthStatus);
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: `Health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      },
      { status: 500 }
    );
  }
}
