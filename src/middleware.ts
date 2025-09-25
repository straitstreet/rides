/**
 * Middleware for authentication and route protection
 *
 * This middleware handles authentication checks and role-based access control
 * for protected routes like admin panel and dashboards.
 */

import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Define routes that require authentication
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/admin(.*)',
]);

// Define admin-only routes
const isAdminRoute = createRouteMatcher([
  '/admin(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  // Get authentication info
  const { userId, sessionClaims } = await auth();

  // Check if route requires authentication
  if (isProtectedRoute(req)) {
    // Redirect to sign-in if not authenticated
    if (!userId) {
      return NextResponse.redirect(new URL('/sign-in', req.url));
    }

    // Check admin routes
    if (isAdminRoute(req)) {
      const userRole = (sessionClaims?.metadata as { role?: string })?.role;

      // Redirect non-admin users away from admin routes
      if (userRole !== 'admin') {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};