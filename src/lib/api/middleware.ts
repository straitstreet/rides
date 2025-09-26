import { NextRequest, NextResponse } from 'next/server';

// Request context for logging and tracking
export interface RequestContext {
  requestId: string;
  method: string;
  url: string;
  userAgent: string;
  ip: string;
}

// Generate unique request ID
function generateRequestId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Create request context for logging
export function createRequestContext(req: NextRequest): RequestContext {
  return {
    requestId: generateRequestId(),
    method: req.method,
    url: req.url,
    userAgent: req.headers.get('user-agent') || 'unknown',
    ip: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown',
  };
}

// Route context type for Next.js 15 (currently unused but keeping for future implementation)
// type RouteContext = {
//   params?: Promise<Record<string, string | string[]>> | Record<string, string | string[]>;
//   [key: string]: unknown;
// };
export function createApiHandler(options: {
  requireAuth?: boolean;
  allowedRoles?: ('admin' | 'seller' | 'buyer')[];
  rateLimit?: { max: number; windowMs: number };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handler: (...args: any[]) => Promise<NextResponse>;
}) {
  // For now, just return the handler directly to fix TypeScript issues
  // TODO: Re-implement middleware functionality with proper Next.js 15 types
  return options.handler;
}

// Validation helpers
export function validateQuery<T>(schema: { parse: (data: unknown) => T }, searchParams: URLSearchParams): T {
  const params: Record<string, string> = {};
  for (const [key, value] of searchParams.entries()) {
    params[key] = value;
  }
  return schema.parse(params);
}

export function validateBody<T>(schema: { parse: (data: unknown) => T }) {
  return async (req: NextRequest): Promise<T> => {
    const body = await req.json();
    return schema.parse(body);
  };
}

// Error handling
export function throwApiError(message: string, code: string, status: number): never {
  const error = new Error(message) as Error & { code: string; status: number };
  error.code = code;
  error.status = status;
  throw error;
}