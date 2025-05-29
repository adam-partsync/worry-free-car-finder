import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  version: string;
  environment: string;
  services: {
    database: {
      status: 'up' | 'down';
      responseTime?: number;
      error?: string;
    };
    redis?: {
      status: 'up' | 'down';
      responseTime?: number;
      error?: string;
    };
    email: {
      status: 'up' | 'down';
      error?: string;
    };
    apis: {
      dvla: 'up' | 'down' | 'not_configured';
      stripe: 'up' | 'down' | 'not_configured';
      ebay: 'up' | 'down' | 'not_configured';
    };
  };
  metrics: {
    uptime: number;
    memory: {
      used: number;
      total: number;
      percentage: number;
    };
    responseTime: number;
  };
}

export async function GET() {
  const startTime = Date.now();
  const health: HealthStatus = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    services: {
      database: { status: 'down' },
      email: { status: 'down' },
      apis: {
        dvla: 'not_configured',
        stripe: 'not_configured',
        ebay: 'not_configured'
      }
    },
    metrics: {
      uptime: process.uptime(),
      memory: {
        used: 0,
        total: 0,
        percentage: 0
      },
      responseTime: 0
    }
  };

  try {
    // Check database connection
    const dbStart = Date.now();
    await db.$connect();
    await db.user.count(); // Simple query to test DB
    await db.$disconnect();

    health.services.database = {
      status: 'up',
      responseTime: Date.now() - dbStart
    };
  } catch (error) {
    health.services.database = {
      status: 'down',
      error: (error as Error).message
    };
    health.status = 'degraded';
  }

  // Check email configuration
  try {
    if (process.env.SMTP_HOST && process.env.SMTP_USER) {
      health.services.email.status = 'up';
    } else {
      health.services.email = {
        status: 'down',
        error: 'SMTP configuration missing'
      };
    }
  } catch (error) {
    health.services.email = {
      status: 'down',
      error: (error as Error).message
    };
  }

  // Check API configurations
  health.services.apis.dvla = process.env.DVLA_MOT_API_KEY ? 'up' : 'not_configured';
  health.services.apis.stripe = process.env.STRIPE_SECRET_KEY ? 'up' : 'not_configured';
  health.services.apis.ebay = process.env.EBAY_APP_ID ? 'up' : 'not_configured';

  // Memory metrics
  const memUsage = process.memoryUsage();
  health.metrics.memory = {
    used: Math.round(memUsage.heapUsed / 1024 / 1024), // MB
    total: Math.round(memUsage.heapTotal / 1024 / 1024), // MB
    percentage: Math.round((memUsage.heapUsed / memUsage.heapTotal) * 100)
  };

  // Response time
  health.metrics.responseTime = Date.now() - startTime;

  // Determine overall status
  if (health.services.database.status === 'down') {
    health.status = 'unhealthy';
  } else if (health.services.email.status === 'down') {
    health.status = 'degraded';
  }

  // Return appropriate HTTP status
  const statusCode = health.status === 'healthy' ? 200 : health.status === 'degraded' ? 200 : 503;

  return NextResponse.json(health, { status: statusCode });
}

// Detailed health check endpoint
export async function POST() {
  const startTime = Date.now();

  try {
    // Run comprehensive health checks
    const checks = await Promise.allSettled([
      checkDatabaseHealth(),
      checkEmailService(),
      checkExternalAPIs(),
      checkSystemResources()
    ]);

    const results = {
      timestamp: new Date().toISOString(),
      duration: Date.now() - startTime,
      checks: {
        database: checks[0].status === 'fulfilled' ? checks[0].value : { status: 'failed', error: checks[0].reason },
        email: checks[1].status === 'fulfilled' ? checks[1].value : { status: 'failed', error: checks[1].reason },
        apis: checks[2].status === 'fulfilled' ? checks[2].value : { status: 'failed', error: checks[2].reason },
        system: checks[3].status === 'fulfilled' ? checks[3].value : { status: 'failed', error: checks[3].reason }
      }
    };

    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json(
      { error: 'Health check failed', details: (error as Error).message },
      { status: 500 }
    );
  }
}

async function checkDatabaseHealth() {
  const start = Date.now();

  try {
    await db.$connect();

    // Test basic operations
    const userCount = await db.user.count();
    const searchCount = await db.search.count();

    await db.$disconnect();

    return {
      status: 'healthy',
      responseTime: Date.now() - start,
      stats: {
        users: userCount,
        searches: searchCount,
        connection: 'active'
      }
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: (error as Error).message,
      responseTime: Date.now() - start
    };
  }
}

async function checkEmailService() {
  return {
    status: process.env.SMTP_HOST ? 'configured' : 'not_configured',
    provider: process.env.SMTP_HOST || 'none',
    features: {
      notifications: !!process.env.SMTP_HOST,
      alerts: !!process.env.SMTP_HOST
    }
  };
}

async function checkExternalAPIs() {
  return {
    dvla: {
      status: process.env.DVLA_MOT_API_KEY ? 'configured' : 'not_configured',
      features: ['mot_history', 'vehicle_data']
    },
    stripe: {
      status: process.env.STRIPE_SECRET_KEY ? 'configured' : 'not_configured',
      features: ['payments', 'webhooks']
    },
    hpi: {
      status: process.env.HPI_API_KEY ? 'configured' : 'not_configured',
      features: ['vehicle_history', 'finance_check']
    },
    autotrader: {
      status: process.env.AUTOTRADER_API_KEY ? 'configured' : 'not_configured',
      features: ['market_data', 'price_analysis']
    }
  };
}

async function checkSystemResources() {
  const memUsage = process.memoryUsage();

  return {
    uptime: process.uptime(),
    memory: {
      heap_used: Math.round(memUsage.heapUsed / 1024 / 1024),
      heap_total: Math.round(memUsage.heapTotal / 1024 / 1024),
      external: Math.round(memUsage.external / 1024 / 1024),
      rss: Math.round(memUsage.rss / 1024 / 1024)
    },
    cpu: {
      usage: process.cpuUsage(),
      platform: process.platform,
      arch: process.arch
    },
    node_version: process.version,
    environment: process.env.NODE_ENV
  };
}
