/**
 * Production monitoring and logging utilities
 */

export interface LogEntry {
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  timestamp: string;
  userId?: string;
  requestId?: string;
  metadata?: Record<string, unknown>;
}

export interface MetricEntry {
  name: string;
  value: number;
  unit?: string;
  timestamp: string;
  tags?: Record<string, string>;
}

class Logger {
  private environment: string;
  private isDevelopment: boolean;

  constructor() {
    this.environment = process.env.NODE_ENV || 'development';
    this.isDevelopment = this.environment === 'development';
  }

  private createLogEntry(
    level: LogEntry['level'],
    message: string,
    metadata?: Record<string, unknown>
  ): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      metadata: {
        environment: this.environment,
        ...metadata,
      },
    };
  }

  private log(entry: LogEntry) {
    if (this.isDevelopment) {
      // Development: use console with colors
      const colors = {
        info: '\x1b[36m',  // cyan
        warn: '\x1b[33m',  // yellow
        error: '\x1b[31m', // red
        debug: '\x1b[90m', // gray
      };
      const reset = '\x1b[0m';

      console.log(
        `${colors[entry.level]}[${entry.level.toUpperCase()}]${reset} ${entry.timestamp} - ${entry.message}`,
        entry.metadata ? entry.metadata : ''
      );
    } else {
      // Production: structured JSON logging
      console.log(JSON.stringify(entry));
    }

    // In production, send to monitoring service
    if (!this.isDevelopment) {
      this.sendToMonitoringService(entry);
    }
  }

  private sendToMonitoringService(entry: LogEntry): void {
    // TODO: Implement Google Cloud Logging integration
    // For production, we'll use Google Cloud Logging
    if (this.environment === 'production' && process.env.GOOGLE_CLOUD_PROJECT_ID) {
      // Send to Google Cloud Logging
      console.log(JSON.stringify({
        severity: entry.level.toUpperCase(),
        message: entry.message,
        timestamp: entry.timestamp,
        labels: {
          environment: this.environment,
          service: 'naija-rides',
          ...entry.metadata,
        },
      }));
    } else if (this.environment !== 'development') {
      // Fallback for other environments
      console.log('MONITORING:', JSON.stringify(entry));
    }
  }

  info(message: string, metadata?: Record<string, unknown>) {
    this.log(this.createLogEntry('info', message, metadata));
  }

  warn(message: string, metadata?: Record<string, unknown>) {
    this.log(this.createLogEntry('warn', message, metadata));
  }

  error(message: string, error?: Error, metadata?: Record<string, unknown>) {
    const errorMetadata = error
      ? {
          error: {
            name: error.name,
            message: error.message,
            stack: error.stack,
          },
          ...metadata,
        }
      : metadata;

    this.log(this.createLogEntry('error', message, errorMetadata));
  }

  debug(message: string, metadata?: Record<string, unknown>) {
    if (this.isDevelopment) {
      this.log(this.createLogEntry('debug', message, metadata));
    }
  }
}

class Metrics {
  private metrics: MetricEntry[] = [];

  private createMetricEntry(
    name: string,
    value: number,
    unit?: string,
    tags?: Record<string, string>
  ): MetricEntry {
    return {
      name,
      value,
      unit,
      timestamp: new Date().toISOString(),
      tags: {
        environment: process.env.NODE_ENV || 'development',
        ...tags,
      },
    };
  }

  private sendMetric(metric: MetricEntry) {
    this.metrics.push(metric);

    // In development, just log
    if (process.env.NODE_ENV === 'development') {
      console.log(`📊 Metric: ${metric.name} = ${metric.value}${metric.unit || ''}`, metric.tags);
    } else {
      // In production, send to monitoring service
      this.sendToMonitoringService(metric);
    }
  }

  private sendToMonitoringService(metric: MetricEntry): void {
    // TODO: Implement Google Cloud Monitoring integration
    // For production, we'll use Google Cloud Monitoring
    if (process.env.NODE_ENV === 'production' && process.env.GOOGLE_CLOUD_PROJECT_ID) {
      // Send to Google Cloud Monitoring (structured format for Cloud Run)
      console.log(JSON.stringify({
        severity: 'INFO',
        message: `Metric: ${metric.name}`,
        timestamp: metric.timestamp,
        labels: {
          metric_name: metric.name,
          metric_value: metric.value.toString(),
          metric_unit: metric.unit || 'count',
          environment: process.env.NODE_ENV,
          service: 'naija-rides',
          ...metric.tags,
        },
      }));
    } else if (process.env.NODE_ENV !== 'development') {
      console.log('METRICS:', JSON.stringify(metric));
    }
  }

  count(name: string, value: number = 1, tags?: Record<string, string>) {
    this.sendMetric(this.createMetricEntry(name, value, 'count', tags));
  }

  gauge(name: string, value: number, unit?: string, tags?: Record<string, string>) {
    this.sendMetric(this.createMetricEntry(name, value, unit, tags));
  }

  timing(name: string, value: number, tags?: Record<string, string>) {
    this.sendMetric(this.createMetricEntry(name, value, 'ms', tags));
  }

  histogram(name: string, value: number, unit?: string, tags?: Record<string, string>) {
    this.sendMetric(this.createMetricEntry(name, value, unit, tags));
  }
}

class PerformanceMonitor {
  private startTimes = new Map<string, number>();

  private now(): number {
    // Use performance.now() if available (browser/modern Node.js)
    if (typeof performance !== 'undefined' && performance.now) {
      return performance.now();
    }
    // Fallback to Date.now() for compatibility
    return Date.now();
  }

  start(operationName: string): void {
    this.startTimes.set(operationName, this.now());
  }

  end(operationName: string, tags?: Record<string, string>): number {
    const startTime = this.startTimes.get(operationName);
    if (!startTime) {
      logger.warn(`Performance monitoring: No start time found for ${operationName}`);
      return 0;
    }

    const duration = this.now() - startTime;
    this.startTimes.delete(operationName);

    metrics.timing(`operation.${operationName}`, duration, tags);

    return duration;
  }

  measure<T>(operationName: string, fn: () => T, tags?: Record<string, string>): T {
    this.start(operationName);
    try {
      const result = fn();
      this.end(operationName, tags);
      return result;
    } catch (error) {
      this.end(operationName, { ...tags, status: 'error' });
      throw error;
    }
  }

  async measureAsync<T>(
    operationName: string,
    fn: () => Promise<T>,
    tags?: Record<string, string>
  ): Promise<T> {
    this.start(operationName);
    try {
      const result = await fn();
      this.end(operationName, tags);
      return result;
    } catch (error) {
      this.end(operationName, { ...tags, status: 'error' });
      throw error;
    }
  }
}

// Health check utilities
export class HealthChecker {
  private checks: Map<string, () => Promise<boolean>> = new Map();

  addCheck(name: string, checkFn: () => Promise<boolean>) {
    this.checks.set(name, checkFn);
  }

  async runChecks(): Promise<{ status: 'healthy' | 'unhealthy'; checks: Record<string, boolean> }> {
    const results: Record<string, boolean> = {};
    let allHealthy = true;

    for (const [name, checkFn] of this.checks) {
      try {
        const result = await checkFn();
        results[name] = result;
        if (!result) allHealthy = false;
      } catch (error) {
        logger.error(`Health check failed: ${name}`, error);
        results[name] = false;
        allHealthy = false;
      }
    }

    return {
      status: allHealthy ? 'healthy' : 'unhealthy',
      checks: results,
    };
  }
}

// Singleton instances
export const logger = new Logger();
export const metrics = new Metrics();
export const performance = new PerformanceMonitor();
export const healthChecker = new HealthChecker();

// Request context utilities
export function createRequestContext(request: Request | { headers: Headers; url: string; method: string }) {
  const requestId = crypto.randomUUID();
  const userAgent = request.headers?.get('user-agent') || 'unknown';
  const ip = request.headers?.get('x-forwarded-for') || 'unknown';

  return {
    requestId,
    userAgent,
    ip,
    method: request.method || 'unknown',
    url: request.url || 'unknown',
    timestamp: new Date().toISOString(),
  };
}

// Error tracking utilities
export function trackError(error: Error, context?: Record<string, unknown>) {
  logger.error('Application error', error, context);
  metrics.count('errors.total', 1, {
    error_type: error.name,
    environment: process.env.NODE_ENV || 'development'
  });
}

// API performance tracking
export function trackApiCall(
  method: string,
  path: string,
  statusCode: number,
  duration: number,
  userId?: string
) {
  metrics.timing('api.request.duration', duration, {
    method,
    path,
    status_code: statusCode.toString(),
    user_id: userId || 'anonymous'
  });

  metrics.count('api.request.total', 1, {
    method,
    path,
    status_code: statusCode.toString()
  });
}

// Database performance tracking
export function trackDatabaseQuery(
  operation: string,
  table: string,
  duration: number,
  success: boolean
) {
  metrics.timing('database.query.duration', duration, {
    operation,
    table,
    status: success ? 'success' : 'error'
  });

  metrics.count('database.query.total', 1, {
    operation,
    table,
    status: success ? 'success' : 'error'
  });
}