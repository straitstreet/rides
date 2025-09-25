/**
 * Main Dashboard Page Component
 *
 * This component renders different dashboard views based on user role:
 * - Sellers see their car listings, bookings, earnings
 * - Buyers see their rental history, favorites, upcoming trips
 *
 * Features:
 * - Role-based content rendering
 * - Real-time statistics and metrics
 * - Quick action buttons
 * - Recent activity feeds
 */

'use client';

import { getMockUser } from '@/lib/auth';
import { useUser } from '@clerk/nextjs';
import { SellerDashboard } from '@/components/dashboard/seller-dashboard';
import { BuyerDashboard } from '@/components/dashboard/buyer-dashboard';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

/**
 * Dashboard Page Component
 *
 * Routes users to appropriate dashboard based on their role
 */
export default function DashboardPage() {
  const { user: clerkUser, isLoaded } = useUser();

  // Use Clerk user data - only fall back to mock in development
  const user = clerkUser ? {
    id: clerkUser.id,
    email: clerkUser.emailAddresses[0]?.emailAddress || '',
    firstName: clerkUser.firstName || '',
    lastName: clerkUser.lastName || '',
    role: (clerkUser.publicMetadata?.role as 'admin' | 'seller' | 'buyer') || 'buyer',
    isVerified: clerkUser.emailAddresses[0]?.verification?.status === 'verified',
    profileImage: clerkUser.imageUrl,
  } : (process.env.NODE_ENV === 'development' ? getMockUser() : null);

  // Handle case where user is not authenticated
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-96">
          <CardHeader>
            <div className="flex items-center space-x-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              <h2 className="text-lg font-semibold">Authentication Required</h2>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Please sign in to access your dashboard.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render appropriate dashboard based on user role
  switch (user.role) {
    case 'seller':
      return <SellerDashboard user={user} />;

    case 'buyer':
      return <BuyerDashboard user={user} />;

    default:
      return (
        <div className="flex items-center justify-center min-h-screen">
          <Card className="w-96">
            <CardHeader>
              <div className="flex items-center space-x-2 text-yellow-600">
                <AlertTriangle className="h-5 w-5" />
                <h2 className="text-lg font-semibold">Invalid User Role</h2>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Your account role is not recognized. Please contact support.
              </p>
            </CardContent>
          </Card>
        </div>
      );
  }
}