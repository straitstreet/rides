import { NextRequest, NextResponse } from 'next/server';
import { ZodSchema, ZodError } from 'zod';
import { getCurrentUser } from '@/lib/auth-server';

export interface ApiError {
  message: string;
  code: string;
  status: number;
  details?: any;
}

export class ApiException extends Error {
  constructor(public apiError: ApiError) {
    super(apiError.message);
    this.name = 'ApiException';
  }
}

// Rate limiting store (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export function createApiHandler(options?: {
  requireAuth?: boolean;
  allowedRoles?: ('admin' | 'seller' | 'buyer')[];
  rateLimit?: { max: number; windowMs: number };
}) {
  return function apiHandler(
    handler: (req: NextRequest, context?: any) => Promise<NextResponse>
  ) {
    return async (req: NextRequest, context?: any): Promise<NextResponse> => {
      try {
        // Rate limiting
        if (options?.rateLimit) {
          const clientId = req.ip || 'anonymous';
          const now = Date.now();
          const windowMs = options.rateLimit.windowMs;
          const maxRequests = options.rateLimit.max;

          const current = rateLimitStore.get(clientId);
          if (current && now < current.resetTime) {
            if (current.count >= maxRequests) {
              return NextResponse.json(
                { error: 'Too many requests', code: 'RATE_LIMIT_EXCEEDED' },
                { status: 429 }
              );
            }
            current.count++;
          } else {
            rateLimitStore.set(clientId, {
              count: 1,
              resetTime: now + windowMs,
            });
          }
        }

        // Authentication check
        if (options?.requireAuth) {
          const user = await getCurrentUser();
          if (!user) {
            return NextResponse.json(
              { error: 'Authentication required', code: 'UNAUTHORIZED' },
              { status: 401 }
            );
          }

          // Role check
          if (options.allowedRoles && !options.allowedRoles.includes(user.role)) {
            return NextResponse.json(
              { error: 'Insufficient permissions', code: 'FORBIDDEN' },
              { status: 403 }
            );
          }
        }

        // Call the actual handler
        return await handler(req, context);
      } catch (error) {
        console.error('API Error:', error);

        if (error instanceof ApiException) {
          return NextResponse.json(
            {
              error: error.apiError.message,
              code: error.apiError.code,
              details: error.apiError.details
            },
            { status: error.apiError.status }
          );
        }

        if (error instanceof ZodError) {
          return NextResponse.json(
            {
              error: 'Validation failed',
              code: 'VALIDATION_ERROR',
              details: error.errors,
            },
            { status: 400 }
          );
        }

        // Generic error
        return NextResponse.json(
          { error: 'Internal server error', code: 'INTERNAL_ERROR' },
          { status: 500 }
        );
      }
    };
  };
}

export function validateBody<T>(schema: ZodSchema<T>) {
  return async (req: NextRequest): Promise<T> => {
    try {
      const body = await req.json();
      return schema.parse(body);
    } catch (error) {
      if (error instanceof ZodError) {
        throw error;
      }
      throw new ApiException({
        message: 'Invalid JSON body',
        code: 'INVALID_JSON',
        status: 400,
      });
    }
  };
}

export function validateQuery<T>(schema: ZodSchema<T>, searchParams: URLSearchParams): T {
  const params = Object.fromEntries(searchParams.entries());
  return schema.parse(params);
}

// Helper to throw API errors
export function throwApiError(message: string, code: string, status: number, details?: any): never {
  throw new ApiException({ message, code, status, details });
}